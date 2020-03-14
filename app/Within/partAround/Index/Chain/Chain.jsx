import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import stylesNail from "../../../stylesNail.module.css";
import ChainUpload from './ChainUpload.jsx';
import NailBasic from '../../../../Components/Nails/NailBasic/NailBasic.jsx';
import NailShared from '../../../../Components/Nails/NailShared/NailShared.jsx';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Chain extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nailFirst: false, //because we sould not render anything if the res nail was empty
      nailSecond: false,
      firstify: false,
      belongify: false,
      fetched: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.nailsKey = ['nailFirst', 'nailSecond'];
    this.axiosSource = axios.CancelToken.source();
    this._set_ChainUnits = this._set_ChainUnits.bind(this);
    this._render_ChainUnits = this._render_ChainUnits.bind(this);
    this._render_HintMessage = this._render_HintMessage.bind(this);
    this._axios_get_chainlist = this._axios_get_chainlist.bind(this);
  }

  _set_ChainUnits(){
    const self = this;
    this.setState({axios: true});

    this._axios_get_chainlist()
    .then((resObj)=>{
      let unitsList =[]; //list composed of unitId, prepared for getting their basic info for Nail
      //and remember, the 'unitId' in res were 'exposeId'
      if('unitId' in resObj.main['orderFirst']) unitsList.push(resObj.main['orderFirst'].unitId);
      if('unitId' in resObj.main['orderSecond']) unitsList.push(resObj.main['orderSecond'].unitId);

      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      this.setState({
        nailFirst: resObj.main.orderFirst,
        nailSecond: resObj.main.orderSecond,
        firstify: resObj.main.firstsetify,
        belongify: resObj.main.belongify,
        fetched: true
      });
      this.props._set_mountToDo('chainlist'); // and, after we get the list back, inform the parent we are done with the lastVisit time

      return axios_get_UnitsBasic(self.axiosSource.token, unitsList); //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _axios_get_chainlist(){
    return axios.get('/router/feed/chainlist', {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    /*
    GET　chain list if! the belongsByType has changed
    */
    const recKeys = Object.keys(this.props.belongsByType);
    //it's very slow to compare 2 obj directly, so just compare by key pair we already set up
    let residenceify = (this.props.belongsByType['residence'] == prevProps.belongsByType['residence']) ? true:false;
    let homelandify = (this.props.belongsByType['homeland'] == prevProps.belongsByType['homeland']) ? true:false;
    if(recKeys.length > 0 && !residenceify && !homelandify){ //if Not the same
      this._set_ChainUnits();
    }
  }

  componentDidMount(){
    /*
    if props.belongsByType has something,
    GET　chain list
    */
    const recKeys = Object.keys(this.props.belongsByType);
    if(recKeys.length> 0) this._set_ChainUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_HintMessage(){
    const recKeys = Object.keys(this.props.belongsByType);

    if(recKeys == 0){
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          {this.props.i18nUIString.catalog["guidingChain_noBelongSet"]}
        </div>
      )
    }else if(this.state.belongify){
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          <span>{this.props.i18nUIString.catalog["guidingChain_noSharedEst."][0]}</span>
          <span>{this.props.i18nUIString.catalog["guidingChain_noSharedEst."][1]}</span>
        </div>
      )
    }else{
      return null
    }
  }

  _render_ChainUnits(){
    let nailsDOM = [];

    this.nailsKey.forEach((order, index) => {
      //render if there are something in the data
      if('unitId' in this.state[order]){
        let unitId = this.state[order].unitId;
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch

        switch (this.state[order].form) {
          case 'shared':
            nailsDOM.push(
              <div
                key={"key_ChainNail_"+order}
                className={classnames(stylesNail.boxNail, stylesNail.heightBasic, stylesNail.wideBasic)}>
                <NailShared
                  {...this.props}
                  unitId={unitId}
                  linkPath={'/unit'}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            )
            break;
          case 'assign':
            nailsDOM.push(
              <div
                key={"key_ChainNail_"+order}
                className={classnames(stylesNail.boxNail, stylesNail.heightBasic, stylesNail.wideBasic)}>
                <NailBasic
                  {...this.props}
                  unitId={unitId}
                  linkPath={'/unit'}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            )
            break;
          default:
            nailsDOM.push(
              <div
                key={"key_ChainNail_"+order}
                className={classnames(stylesNail.boxNail, stylesNail.heightBasic, stylesNail.wideBasic)}>
                <NailShared
                  {...this.props}
                  unitId={unitId}
                  linkPath={'/unit'}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            )
        }
      }
    });

    return nailsDOM;
  }

  render(){
    return (
      <div
        className={classnames(styles.comChain)}>
        {this._render_HintMessage()}
        {
          this.state.nailFirst &&
          <div
            className={classnames(styles.boxModule)}>
            <div>
              {this._render_ChainUnits()}
            </div>
            <div
              className={classnames(styles.boxChainUpload)}>
              <ChainUpload
                {...this.state}
                nailsKey = {this.nailsKey}
                _set_ChainUnits={this._set_ChainUnits}
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Chain));
