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
import NavWihtinCosmic from '../../../Components/NavWithin/NavWihtinCosmic.jsx';
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
    return(
      <div>
        <div
          className={classnames(styles.comAtNode)}>
          { // this button & nav bar only appear if user signed in
            (this.props.tokenStatus== 'verified') &&
            <div
              className={classnames(
                styles.boxNavCosmic,
                styles.smallDisplayNone)}>
                <NavWihtinCosmic/>
            </div>
          }
          <div
            className={classnames(styles.boxRow, styles.boxTitle)}
            style={{paddingBottom: '14px'}}>
            <TitlePath
              title={this.state.projectName}/>
          </div>
          <div>
            <NavFilter
              {...this.props}
              viewFilter={this.state.viewFilter}
              projectInfo={this.state.projectInfo}
              _set_viewFilter={this._set_viewFilter}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            { // render NodesFilter only after the filterStart was fetched
              (this.state.viewFilter && !!this.state.filterStart) ? (
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
              ):(
                <div>
                  <NavFeed {...this.props}/>
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
