import React from 'react';
import {
  Link,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import NavFeed from './NavFeed/NavFeed.jsx';
import TitlePath from './TitlePath/TitlePath.jsx';
import NavTitleRow from './NavFilter/NavTitleRow.jsx';
import {
  _axios_get_projectBasic,
  _axios_get_projectNodes,
  _axios_get_nodesUnits
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import NodesFilter from '../../../Components/NodesFilter/NodesFilter.jsx';
import NavCosmicMobile from '../../../Components/NavWithin/NavCosmic/NavCosmicMobile.jsx';
import NavCosmicMobileUnsign from '../../../Components/NavWithin/NavCosmic/NavCosmicMobileUnsign.jsx';
import {
  handleNounsList,
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
      pathName: false,
      projectName: '',
      filterStart: null,
      projectInfo: {
        inspiredCount: 0,
        inspiredYou: false
      },
      subCatesInfo: {
        subCatesList: [],
        subCatesObj: {}
      },
      usedNodes: [],
      fetchedUsedNodes: false,
      redirectFilter: false,
      redirectFilterPass: 0
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_viewFilter = this._set_viewFilter.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_projectBasic = this._set_projectBasic.bind(this);
    this._set_usedNodes = this._set_usedNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.redirectFilterPass){ // if just redirect to or from Filter
      this.setState({
	      redirectFilter: false,
        redirectFilterPass: 0
      });
    };
    if(this.props.match.params['pathName'] != prevProps.match.params['pathName']){ // jump to diff. pathProject
      this._set_projectBasic();
    };
    let urlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.viewFilter != urlParams.has('_filter_nodes')){
      if(!this.viewFilter) this.setState({usedNodes: [], fetchedUsedNodes: false})
      else{
        this._set_usedNodes();
      };
    };
  }

  componentDidMount(){
    this._set_projectBasic();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    if(this.state.redirectFilter && this.state.redirectFilterPass){
	    /*
	      Notice!, this is not a good method.
	      we should redirect only when close from from NodesFilter, a general component.
	      any other path, passed from Nav, should be dealted with insde the Nav.
		    */
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
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    let unitEntity = {
      subCate: this.currentSubCate ? 'pathProject' : false,
      pathSubCate: (this.currentSubCate && (this.currentSubCate in this.state.subCatesInfo.subCatesObj)) ? {
        subCateify: true,
        currentSubCateId: this.currentSubCate,
        currentSubcateObj: this.state.subCatesInfo.subCatesObj[this.currentSubCate],
        currentPathProject: this.state.pathName
      }: {}
    };

    return(
      <div>
        { // only show up when token show
          (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
            <div
              className={classnames("smallDisplayBox")}>
              <div
                className={classnames(styles.boxNavTop)}>
                <NavCosmicMobileUnsign/>
              </div>
            </div>
          ): (
            <div
              className={classnames("smallDisplayBox")}>
              <div
                className={classnames(styles.boxNavTop)}>
                <NavCosmicMobile/>
              </div>
            </div>
          )
        }
        <div
          className={classnames(styles.comPathProject)}
          onTouchEnd={(event)=>{
            if(
              // this way, stop every touch event to the comp. at Unit opened, including 'scroll'-the main target.
              // It's for ios system which not react to '.body overflow: hidden'
              this.props.location.pathname.includes('/unit') &&
              this.props.location.search.includes('unitId')
            ) event.preventDefault();
          }}>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxTitle)}>
              <TitlePath
                projectPath = {this.state.pathName}
                projectInfo={this.state.projectInfo}
                projectPath = {this.state.pathName}
                title={this.state.projectName}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRowNav)}>
            <div
              className={classnames(styles.boxTitle)}
              style={{marginTop: '4px'}}>
              <NavFeed
                {...this.props}
                subCatesInfo={this.state.subCatesInfo}/>
            </div>
            <div
              className={classnames(
                styles.rowFilterMargin,
                {[styles.rowFilterPadding]: (!!this.filterNode)})}>
              <NavTitleRow
                {...this.props}
                listLocation={"pathProject"}
                listIdentity={this.props.match.params['pathName']}
                viewFilter={this.viewFilter}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            {
              this.viewFilter ? (
                <div
                  className={classnames(styles.boxNodesFilter)}>
                  {
                    this.state.fetchedUsedNodes &&
                    <div>
                      <NodesFilter
                        {...this.props}
                        startNode = {this.state.filterStart}
                        startList={this.state.usedNodes}
                        _handle_nodeClick={this._set_viewFilter}
                        _get_nodesUnitsList={(nodesList)=>{
                          // return a promise() to NodesFilter
                          return _axios_get_nodesUnits(this.axiosSource.token, {
                            nodesList: nodesList,
                            pathName: this.props.match.params['pathName'],
                            filterSubCate: this.currentSubCate ? this.currentSubCate : null
                          })
                        }}/>
                        <div className={classnames(styles.boxFooter)}/>
                    </div>
                  }
                </div>
              ):(
                <div
                  className={classnames(styles.boxFeed)}>
                  <Feed
                    {...this.props}/>
                </div>
              )
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            // PathProject allow no token browse, so we have to use different Unit for both condition
            return (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
              <UnitUnsign
                {...props}
                unitEntity= {unitEntity}
                _refer_von_unit={this.props._refer_to}/>
            ):(
              <UnitScreen
                {...props}
                unitEntity= {unitEntity}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _set_viewFilter(view){
    this.setState({
	    redirectFilter: !!view ? view : true, // currently, always redirect it triggered
      redirectFilterPass: 1
    })
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _set_projectBasic(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectBasic(this.axiosSource.token, this.props.match.params['pathName'])
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          axios: false,
          pathName: resObj.main.pathName,
          projectName: resObj.main.name,
          filterStart: resObj.main.nodeStart,
          projectInfo: resObj.main.otherInfo,
          subCatesInfo: resObj.main.subCatesInfo
        };
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

  _set_usedNodes(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectNodes(this.axiosSource.token, {
      pathProject: this.props.match.params['pathName'],
      filterSubCate: this.currentSubCate ? this.currentSubCate : null
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          usedNodes: resObj.main.nodesList,
          fetchedUsedNodes: true
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
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
