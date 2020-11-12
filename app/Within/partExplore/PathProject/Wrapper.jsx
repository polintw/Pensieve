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
import Feed from './Feed/Feed.jsx';
import NavFeed from './NavFeed/NavFeed.jsx';
import NavFilter from './NavFilter/NavFilter.jsx';
import TitlePath from './TitlePath/TitlePath.jsx';
import {
  _axios_get_projectBasic,
  _axios_get_projectNodes,
  _axios_get_projectLayerFirstUnits
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import NodesFilter from '../../../Components/NodesFilter/NodesFilter.jsx';
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
      viewFilter: false,
      pathName: false,
      projectName: '',
      filterStart: null,
      projectInfo: {},
      usedNodes: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_viewFilter = this._set_viewFilter.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_projectBasic = this._set_projectBasic.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.match.params['pathName'] != prevProps.match.params['pathName']){
      this._set_projectBasic();
    }
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
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;

    return(
      <div>
        <div
          className={classnames(styles.comPathProject)}>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxTitle)}>
              <TitlePath
                projectPath = {this.state.pathName}
                title={this.state.projectName}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRowNav)}>
            <NavFilter
              {...this.props}
              viewFilter={this.state.viewFilter}
              projectPath = {this.state.pathName}
              projectInfo={this.state.projectInfo}
              _set_viewFilter={this._set_viewFilter}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            { // render NodesFilter only after the filterStart was fetched
              (this.state.viewFilter && !!this.state.filterStart) ? (
                <div
                  className={classnames(styles.boxTitle)}>
                  <NodesFilter
                    nodePageify={true}
                    startListify={true}
                    startList={this.state.usedNodes}
                    startNode={this.state.filterStart}
                    _handle_nodeClick={this._set_viewFilter}
                    _get_firstUnitsList={(nodesList)=>{
                      // return a promise() to NodesFilter
                      return _axios_get_projectLayerFirstUnits(this.axiosSource.token, {
                        nodesList: nodesList, pathName: this.props.match.params['pathName']
                      })
                    }}/>
                  <div className={classnames(styles.boxFooter)}/>
                </div>
              ):(
                <div
                  className={classnames(styles.boxFeed)}>
                  {
                    !this.filterNode && // render only when no filterNode
                    <NavFeed {...this.props}/>
                  }
                  <Feed {...this.props}/>
                </div>
              )
            }
          </div>

          <div className={classnames(styles.boxDecoBottom, styles.smallDisplayNone)}></div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
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

  _set_viewFilter(view){
    this.setState({
      viewFilter: !!view ? view : false
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
          pathName: resObj.main.pathName,
          projectName: resObj.main.name,
          filterStart: resObj.main.nodeStart,
          projectInfo: resObj.main.otherInfo
        };
      });

      return _axios_get_projectNodes(this.axiosSource.token, this.props.match.params['pathName']);
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
