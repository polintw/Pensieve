import React from 'react';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Nav from './Nav/Nav.jsx';
import Feed from './Feed/Feed.jsx';
import TitleUser from './TitleUser/TitleUser.jsx';
import NodesFilter from './NodesFilter/NodesFilter.jsx';
import NavCosmicMobile from '../../../Components/NavWithin/NavCosmic/NavCosmicMobile.jsx';
import {
  _axios_get_Basic
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  handleNounsList,
  handleUsersList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      filterStart: null,
      userBasicInfo: {
        timeCreate: null,
        countShareds: 0,
        inspiredCount: 0,
        inspiredYou: false
      },
      usedNodes: [],
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_filterBasic = this._set_filterBasic.bind(this);
    this._render_Content = this._render_Content.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let preUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.userId != preUrlParams.get('userId') ){ // that's, if the page was jump to next user
      this._set_filterBasic();
    };
  }

  componentDidMount(){
    this._set_filterBasic();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_Content(){
    let contentView = this.urlParams.has("content") ? this.urlParams.get('content') : '';

    switch (contentView) {
      case "achieve":
        return null // temp
        break;
      default:
        return (
          // render NodesFilter only after the filterStart was fetched
            (this.viewFilter && !!this.state.filterStart) ? (
              <div
                className={classnames(styles.boxNodesFilter)}>
                <NodesFilter
                  nodePageify={true}
                  startListify={true}
                  startList={this.state.usedNodes}
                  startNode={this.state.filterStart}
                  _handle_nodeClick={() => { /* do nothing in this comp */}}
                  _get_firstUnitsList={(nodesList)=>{
                    // return a promise() to NodesFilter
                    return _axios_get_Basic(this.axiosSource.token, {
                      url: '/router/people/accumulated/nodes',
                      params: {nodesList: nodesList, userId: this.userId, depth: "first"}
                    })
                  }}/>
                <div className={classnames(styles.boxFooter)}/>
              </div>
            ):(
              <div
                className={classnames(styles.boxFeed)}>
                <Feed
                  {...this.props}
                  userId = {this.userId}/>
              </div>
            )
        )
    };
  }

  render(){
    this.urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.userId = this.urlParams.get('userId');
    let contentView = this.urlParams.has("content") ? this.urlParams.get('content') : '';
    if(this.urlParams.has('_filter_nodes') && (contentView.length == 0) /* like contentView above */){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return(
      <div>
        <div
          className={classnames("smallDisplayBox")}>
          <div
            className={classnames(styles.boxNavTop)}>
            <NavCosmicMobile/>
          </div>
        </div>
        <div
          className={classnames(styles.comSeeUser)}>
          <div
            className={classnames(styles.boxRow)}>
            <TitleUser
              userId = {this.userId}
              userBasicInfo={this.state.userBasicInfo}/>
          </div>
          <div
            className={classnames(
              styles.boxRowNav)}>
            <Nav
              {...this.props}
              userId = {this.userId}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            { this._render_Content()}
          </div>
        </div>
        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            // PathProject allow no token browse, so we have to use different Unit for both condition
            return (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
              <UnitUnsign
                {...props}
                _refer_von_unit={this.props._refer_to}/>
            ):(
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _set_filterBasic(){
    const self = this;
    this.setState({axios: true});

    let basicReqObj = { // for now, GET filterStart
      url: '/router/people/basic',
      params: {userId: this.userId}
    };
    let usedNodesReqObj = {
      url: '/router/people/nodes/assigned',
      params: {userId: this.userId}
    };
    // start, first make sure the userrrr basic was on the list
    this.props._submit_UsersList_new([this.userId]);
    // then req basic(filterStart)
    _axios_get_Basic(this.axiosSource.token, basicReqObj)
    .then((resObj)=> {
      self.setState({
        filterStart: resObj.main.nodeStart,
        userBasicInfo: resObj.main.userBasicInfo
      });
      return _axios_get_Basic(this.axiosSource.token, usedNodesReqObj);
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          usedNodes: resObj.main.nodesList
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

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
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
)(Wrapper));
