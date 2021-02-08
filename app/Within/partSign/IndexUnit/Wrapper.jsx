import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SignBlock from '../components/SignBlock/SignBlock.jsx';
import stylesNail from "../../stylesNail.module.css";
import NailFeed from '../../../Components/Nails/NailFeed/NailFeed.jsx';
import NailFeedWide from '../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  handleNounsList,
  handleUsersList,
  handlePathProjectsList
} from "../../../redux/actions/general.js";
import {
  initAround
} from '../../../redux/states/statesWithin.js';
import {
  setIndexList,
} from "../../../redux/actions/within.js";
import {axios_get_UnitsBasic} from '../../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_feedUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    this.props._set_IndexLists(initAround.indexLists);
  }

  _render_FeedNails(){
    if( !this.unitId) return; // no render if no unitId
    //render if there are something in the data
    if( !(this.unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
    let nailsDOM = this.state.unitsList.map((unitId, index)=>{
      // for mobile device, use one special Nail
      let cssVW = window.innerWidth;
      if(cssVW < 860) {
        return (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
            <NailFeedMobile
              {...this.props}
              leftimg={false}
              unitId={unitId}
              linkPath={this.props.location.pathname}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic} />
          </div>
        );
      };

      if(index == 0){
        return (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
            <NailFeedWide
              {...this.props}
              leftimg={false}
              unitId={unitId}
              linkPath={this.props.location.pathname}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        );
      }
      else {
        return (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail)}>
            <NailFeed
              {...this.props}
              unitId={unitId}
              narrowWidth={false}
              linkPath={this.props.location.pathname}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        )
      };
    });

    return nailsDOM;
  }

  render(){
    /*
    this comp. mimic the Around/Wrapper, and its entire children.
    so did the styles we used here.
    */
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('unitView')){
      this.unitView = urlParams.get('unitView');
    } else this.unitView = null;
    if(urlParams.has('unitId')){
      this.unitId = urlParams.get('unitId');
    } else this.unitId = false;

    return(
      <div>
        <div
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>
            <div
              className={classnames(styles.comChain)}>
              <div
                style={{width: '100%', margin: '4px 0'}}>
                <div>
                  <div
                    className={classnames(styles.boxSharedTitle)}>
                    <span
                      className={classnames("fontContentPlain", "weightBold", "colorAssistGold")}>
                      {this.props.i18nUIString.catalog["title_Chain_Shareds_"]}</span>
                  </div>
                  <div
                    className={classnames(styles.boxSharedsDisplay)}>
                    <div
                      className={classnames(styles.boxModuleShareds)}>
                      <div
                        className={classnames(styles.boxSignup)}>
                        <SignBlock
                          description={false}
                          btnDepend={'indexUnit'}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.comNavFeed, styles.boxTitle)}>
              <div
                style={{display:'flex'}}>
                <div
                  topath={"gathering"}>
                  <span
                    className={classnames(
                      "fontContentPlain", "weightBold", "colorAssistGold")}>
                    {this.props.i18nUIString.catalog["title_FeedAssigned_"] }
                  </span>
                </div>
              </div>
            </div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall)}>
              {this._render_FeedNails()}
            </div>
          </div>
          <div
            className={classnames( styles.boxRow, styles.boxSignup)}
            style={{minHeight: '32vh'}}>
            <SignBlock
              description={'seemore'}
              btnDepend={'regular'}/>
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {this._render_FooterHint()}
          </div>
        </div>

        {
          (this.unitId && !!this.unitView) &&
          <UnitUnsign
            {...this.props}
            anchorUnit = {this.unitId}
            _refer_von_unit={this.props._refer_to}/>
        }
      </div>
    )
  }

  _set_feedUnits(){
    const self = this;
    this.setState({axios: true});
    let unitsList = this.unitId ? [this.unitId] : [];

    axios({
      method: 'get',
      url: '/router/units/'+ this.unitId+ '/related',
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      unitsList = unitsList.concat(resObj.main.unitsList);
      self.setState({
        unitsList: unitsList
      });
      return axios_get_UnitsBasic(self.axiosSource.token, unitsList) //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_PathsList_new(resObj.main.pathsList);
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

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    indexLists: state.indexLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_IndexLists: (obj) => { dispatch(setIndexList(obj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_PathsList_new: (arr) => { dispatch(handlePathProjectsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
