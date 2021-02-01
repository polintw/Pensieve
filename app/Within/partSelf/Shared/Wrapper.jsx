import React from 'react';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import TitleShareds from './TitleShareds/TitleShareds.jsx';
import SelfShare from './SelfShare/SelfShare.jsx';
import NavTitleRow from '../../../Components/NavFilter/NavTitleRow.jsx';
import NodesFilter from '../../../Components/NodesFilter/NodesFilter.jsx';
import {
  axios_visit_GET_last,
  axios_visit_Index,
  _axios_get_Basic,
  _axios_get_filterFirstUnits
} from './utils.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  setWithinFlag
} from "../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
      redirectFilter: false,
      redirectFilterPass: 0,
      filterStart: null,
      usedNodes: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_viewFilter = this._set_viewFilter.bind(this);
    this._set_filterBasic = this._set_filterBasic.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // a special condition at the begining: if the belongsByType finally fetched,
    // catched again if at all shareds
    if(this.props.belongsByType.fetched && this.props.belongsByType.fetched != prevProps.belongsByType.fetched){
      this._set_filterBasic();
    };
    // common situation: change between route
    if(this.props.lastParam != prevProps.lastParam){
      this._set_filterBasic();
    };
    if(prevState.redirectFilterPass){ // if just redirect to or from Filter
      this.setState({
        redirectFilter: false,
        redirectFilterPass: 0
      });
    };
  }

  componentDidMount(){
    const self = this;
    this.setState({axios: true});

    this._set_filterBasic();
    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
      });
      axios_visit_Index(self.axiosSource.token);
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }

  render(){
    if(this.state.redirectFilter && this.state.redirectFilterPass){
      // this method now is only used when closing(redirectFilter == true). Feb 01 2021
      let toSearch = new URLSearchParams(this.props.location.search);
      // make sure delte all attrib
      toSearch.delete("_filter_nodes");
      toSearch.delete("_filter_map");
      return <Redirect
        to={{
          pathname: this.props.location.pathname,
          search: toSearch.toString(),
          state: {from: this.props.location}
        }}/>;
    };
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;
    if(urlParams.has('_filter_nodes')){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return(
      <div>
        <div
          className={classnames(styles.comSelfWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRow40Top)}>
            <TitleShareds
              {...this.props}
              viewFilter={this.viewFilter}/>
          </div>
          <div
            style={{display: 'flex', flexDirection: 'column'}}>
            {
              !this.viewFilter &&
              <div
                className={classnames(styles.boxSelfShare)}>
                <SelfShare
                  {...this.props}/>
              </div>
            }
            <div
              className={classnames(
                styles.rowNavFilter,
                {[styles.rowFilterPadding]: (!!this.filterNode)}
              )}>
              <NavTitleRow
                {...this.props}
                listLocation={(this.props.lastParam == "pathProject") ? "personal_pathProject" : "personal"}
                listIdentity={(this.props.lastParam == "pathProject") ? this.props.userInfo.pathName: null}
                viewFilter={this.viewFilter}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            { // render NodesFilter only after the filterStart was fetched
              (this.viewFilter && !!this.state.filterStart) ? (
                <div
                  className={classnames(styles.boxNodesFilter)}>
                  <NodesFilter
                    {...this.props}
                    startNode = {this.state.filterStart}
                    startList={this.state.usedNodes}
                    _handle_nodeClick={this._set_viewFilter}

                    _get_nodesUnitsList={(nodesList)=>{
                      // return a promise() to NodesFilter
                      let paramsObj = (this.props.lastParam == "pathProject") ? ({
                        nodesList: nodesList, pathProject: this.props.userInfo.pathName
                      }): ({nodesList: nodesList});
                      return _axios_get_Basic(this.axiosSource.token, {
                        url: '/router/share/accumulated/depth',
                        params: paramsObj
                      })
                    }}/>
                </div>
              ):(
                <Feed {...this.props}/>
              )
            }
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {
              this._render_FooterHint()
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in /self. */ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _set_filterBasic(){
    const self = this;
    this.setState({axios: true});

    let promiseFirst = ()=>{
      if(this.props.lastParam=="pathProject"){
        return _axios_get_Basic(this.axiosSource.token, {
          params: {pathProject: this.props.userInfo.pathName}, url: '/router/paths/basic'
        })
        .then((resObj)=>{
          this.setState((prevState, props)=>{
            return {
              filterStart: resObj.main.nodeStart,
            };
          });
          return; // to next after f()
        });
      }
      else{
        this.setState((prevState, props)=>{
          return {
            filterStart: this.props.belongsByType[this.props.belongsByType.setTypesList[0]], //could be 'undefined', 'null', or a node
          };
        });
        return Promise.resolve();
      }
    };

    promiseFirst()
    .then(()=>{
      let usedNodesObj = {
        url: '/router/share/nodes/assigned',
        params: (this.props.lastParam == "pathProject" ? {pathProject: this.props.userInfo.pathName} : {})
      };
      return _axios_get_Basic(this.axiosSource.token, usedNodesObj);
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

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _set_viewFilter(view){
    this.setState({
	    redirectFilter: !!view ? view : true, // currently, always redirect it triggered
      redirectFilterPass: 1
    })
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _set_WithinFlag: (bool, flag) => {dispatch(setWithinFlag(bool, flag)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
