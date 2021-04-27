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
  _axios_get_nodesUnits
} from '../axios.js';

class Steps extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      filterStart: null,
      redirectFilter: false,
      redirectFilterPass: 0
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_stepsContent = this._render_stepsContent.bind(this);
    this._set_viewFilter = this._set_viewFilter.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.redirectFilterPass){ // if just redirect to or from Filter
      this.setState({
	      redirectFilter: false,
        redirectFilterPass: 0
      });
    };

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_stepsContent(){
    return (this.filterNode && !this.viewFilter) ? (
      <Feed
        {...this.props}/>
    ) : (
      {
        this.state.fetchedUsedNodes &&
        <div
          className={classnames(styles.boxNodesFilter)}>
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
    );
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
    if(urlParams.has('_filter_nodes') || urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return (
      <div
        className={classnames(styles.comSteps)}>
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
        {
          this._render_stepsContent()
        }
      </div>
    )
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
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Steps));
