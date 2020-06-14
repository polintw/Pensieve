import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../stylesNail.module.css";
import stylesFont from '../../stylesFont.module.css';
import ChainShared from './ChainShared.jsx';
import ChainMessage from './ChainMessage.jsx';
import IndexShare from '../IndexShare/IndexShare.jsx';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  submitChainList
} from "../../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Chain extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetched: false,
      unitsBasic: {},
      marksBasic: {}
    };

    this.axiosSource = axios.CancelToken.source();
    this._set_ChainUnits = this._set_ChainUnits.bind(this);
    this._set_unitBasic = this._set_unitBasic.bind(this);
    this._render_ChainUnits = this._render_ChainUnits.bind(this);
    this._axios_get_chainlist = this._axios_get_chainlist.bind(this);
  }

  _set_ChainUnits(params){
    const self = this;
    this.setState({axios: true});

    this._axios_get_chainlist(params)
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      /*
      resObj.main: {
              sharedPrimer: false,
              userShared: false,
              resToShared: false,
              resToRespond: false,
              latestShared: false,
              }
      */
      let displayOrder = [], displayInfo={};
      displayOrder.push(resObj.main['sharedPrimer'], resObj.main['userShared'], resObj.main['resToShared'],resObj.main['resToRespond'],resObj.main['latestShared']);
      displayOrder = displayOrder.filter((item, index)=> {return item}); //use the property the item would be 'false' if none
      Object.keys(resObj.main).forEach((key, index) => {
        displayInfo[resObj.main[key]] = key;
      });

      self.props._submit_list_Chain({
        listOrderedChain: displayOrder,
        listInfo: displayInfo
      });
      self.setState({
        fetched: true,
      });
      self.props._set_mountToDo('chainlist'); // and, after we get the list back, inform the parent we are done with the lastVisit time
      //and use the list to get the data of each unit
      // no need to 'return' here, let the f() deal with the error itself
      self._set_unitBasic(displayOrder);
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

  _set_unitBasic(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_get_UnitsBasic(this.axiosSource.token, unitsList)
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

  _axios_get_chainlist(params){
    let paramObj = {};
    if(!!params) params.forEach((param, index) => {
      paramObj[param.key] = param.value;
    });

    return axios({
      method: 'get',
      url: '/router/feed/chainlist',
      params: paramObj,
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
    //monitor flag for this comp: 1) new shared by user.
    if(this.props.flagChainFetRespond && this.props.flagChainFetRespond != prevProps.flagChainFetRespond) this._set_ChainUnits([{key: 'respond',value:true}]);
  }

  componentDidMount(){
    this._set_ChainUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_ChainUnits(){
    let nailsDOM = [];
    const props = this.props;

    this.props.chainList.listOrderedChain.forEach((unitId, index) => {
      //render if there are something in the data
      if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
      nailsDOM.push(
        <div
          key={"key_ChainUnits_"+index}
          className={classnames(stylesNail.boxNail)}>
          <NailFeed
            {...this.props}
            unitId={unitId}
            linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
            unitBasic={this.state.unitsBasic[unitId]}
            marksBasic={this.state.marksBasic}/>
        </div>
      );

    });

    return nailsDOM;
  }

  render(){
    return (
      <div
        className={classnames(styles.comChain)}>
        <div
          className={classnames(styles.boxFullWide)}
          style={{margin: '4px 0 8px'}}>
          <ChainShared/>
        </div>
        <div
          className={classnames(styles.boxIndexShare)}>
          <IndexShare
            {...this.props}/>
        </div>
        {
          (this.props.chainList.listOrderedChain.length > 0 && this.props.chainList.listOrderedChain[0] in this.state.unitsBasic) &&
          <div
            className={classnames(styles.boxChainModule)}>
            <div
              className={classnames(
                styles.boxFullWide, styles.boxSeperate
              )}>
              <ChainMessage
                unitsBasic={this.state.unitsBasic}/>
            </div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall
              )}>
              {this._render_ChainUnits()}
            </div>
          </div>
        }
        { // this should be a temp method, to encourage user upload their first unit
          ((this.props.sharedsList.list.length == 0 && this.props.chainList.listOrderedChain.length == 0) &&
            !this.state.axios &&
            (this.props.indexLists.listUnread.length > 0 || this.props.indexLists.listBrowsed.length > 0)
          ) &&
          <div
            className={classnames(styles.boxSeperate, styles.boxFullWide)}
            style={{padding: '8px 0', textAlign: 'center'}}>
            <span
              className={classnames(stylesFont.fontTitleSmall, stylesFont.colorGrey)}>
              {this.props.i18nUIString.catalog['message_Chain_noSharedsCourage']}</span>
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
    belongsByType: state.belongsByType,
    chainList: state.chainList,
    indexLists: state.indexLists,
    flagChainFetRespond: state.flagChainFetRespond
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_Chain: (obj) => { dispatch(submitChainList(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Chain));
