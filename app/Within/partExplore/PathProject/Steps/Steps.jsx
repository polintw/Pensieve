import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from '../Feed/Feed.jsx';
import NavTitleRow from '../NavFilter/NavTitleRow.jsx';
import NodesFilter from '../../../../Components/NodesFilter/NodesFilter.jsx';
import {
  _axios_get_projectNodes,
  _axios_get_nodesUnits
} from '../axios.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class Steps extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      filterStart: null,
      usedNodes: [],
      fetchedUsedNodes: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_stepsContent = this._render_stepsContent.bind(this);
    this._set_usedNodes = this._set_usedNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_usedNodes();
  }

  componentWillUnmount(){

  }

  _render_stepsContent(){
    return (this.filterNode && !this.viewFilter) ? (
      <Feed
        {...this.props}/>
    ) : (
      <div>
        <div
          className={classnames(styles.boxNodesFilter)}>
          {
            this.state.fetchedUsedNodes &&
            <NodesFilter
              {...this.props}
              startNode = {this.state.filterStart}
              startList={this.state.usedNodes}
              _handle_nodeClick={()=>{ /* Do nothing. */ }}
              _get_nodesUnitsList={(nodesList)=>{
                // return a promise() to NodesFilter
                return _axios_get_nodesUnits(this.axiosSource.token, {
                  nodesList: nodesList,
                  pathName: this.props.match.params['pathName'],
                  filterSubCate: null
                })
              }}/>
            }
        </div>
        <div className={classnames(styles.boxFooter)}/>
      </div>
    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;
    if(urlParams.has('_filter_nodes') || urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return (
      <div
        className={classnames(styles.comSteps)}>
        <div
          className={classnames(
            {
              [styles.boxTitleFilter]: !this.filterNode,
              [styles.boxTitleNode]: !!this.filterNode,
              [styles.rowTitlePadding]: (!!this.filterNode),
            })}>
          <NavTitleRow
            {...this.props}/>
        </div>
        {
          this._render_stepsContent()
        }
      </div>
    )
  }

  _set_usedNodes(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectNodes(this.axiosSource.token, {
      pathProject: this.props.match.params['pathName'],
      filterSubCate: null
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
    i18nUIString: state.i18nUIString,
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
)(Steps));
