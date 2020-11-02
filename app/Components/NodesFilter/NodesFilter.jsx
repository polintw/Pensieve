import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_get_NodesLayer
} from './axios.js';
import {
  handleNounsList,
} from "../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: [],
      baseNode: null,
      baseParent: null,
      atStartListify: true,
      nodesUnits: {},
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Nodes = this._render_Nodes.bind(this);
    this._set_nodesList = this._set_nodesList.bind(this);
    this._set_firstUnitBasic = this._set_firstUnitBasic.bind(this);
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleClick_switchUppeLayer = this._handleClick_switchUppeLayer.bind(this);
    this._handleClick_switchStartList = this._handleClick_switchStartList.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.baseNode != prevState.baseNode){
      this._set_nodesList(this.state.baseNode);
    };
  }

  componentDidMount(){
    if(!this.props.startListify && this.state.atStartListify){ // at start list but without a nodesList passed from props
      this.setState({
        baseNode: this.props.startNode,
        atStartListify: false
      });
    }
  }

  componentWillUnmount(){

  }

  _render_Nodes(){
    // devide which list going to render first
    let list = (this.props.startListify && this.state.atStartListify) ? this.props.startList : this.state.nodesList;
    // we need value in URL query
    let urlParams = new URLSearchParams(this.props.location.search), searchStr='?';
    urlParams.delete("filterNode"); // remove any filterNode inherit from props to be used in each node
    urlParams.forEach((value, key) => {
      searchStr+= (key + '=' + value);
    });
    // then going to render by params string & nodesList
    let nodesListDOM = list.map((nodeId, index)=>{
      let searchWithFilterNode = searchStr + '&filterNode=' + nodeId;
      return (
        <Link
          key={"key_nodesFilter_"+index}
          to={{
            pathname: this.props.match.url ,
            search: searchWithFilterNode,
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton')}
          onClick={this._handleClick_filterNode}>
          <span
            className={classnames("fontContentPlain", "weightBold", "colorEditBlack")}>
            {nodeId in this.props.nounsBasic ? (this.props.nounsBasic[nodeId].name) : null}
          </span>
          <span
            className={classnames("fontContentPlain", "weightBold", "colorEditBlack")}>
            {nodeId in this.props.nounsBasic ? (
              (this.props.nounsBasic[nodeId].prefix.length > 0) &&
              (", " + this.props.nounsBasic[nodeId].prefix)) : (null)
            }
          </span>
        </Link>
      );
    })

    return nodesListDOM;
  }

  render(){
    return (
      <div className={styles.comNodesFilter}>
        <div>
          {
            this.props.startListify &&
            <div
              onClick={this._handleClick_switchStartList}>
              <span>
                {this.state.atStartListify ? "In All" : "Only Used"}
              </span>
            </div>
          }
          {
            !this.state.atStartListify &&
            <div
              onClick={this._handleClick_switchUppeLayer}>
              <span>
                {"Upper"}
              </span>
            </div>
          }
        </div>
        <div>
          {this._render_Nodes()}
        </div>
      </div>
    )
  }

  _set_firstUnitBasic(nodesList){
    const self = this;
    this.setState({axios: true});

    return this.props._get_firstUnitsList(nodesList)
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          nodesUnits: {...prevState.nodesUnits, ...resObj.main.nodesUnits}
        };
      });
      let nodesKey = Object.keys(resObj.main.nodesUnits);
      let unitsList = nodesKey.map((key, index)=>{
        return nodesUnits[key];
      });

      return axios_get_UnitsBasic(self.axiosSource.token, unitsList);
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
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

  _set_nodesList(baseNode){
    const self = this;
    this.setState({axios: true});

    _axios_get_NodesLayer(this.axiosSource.token, baseNode)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          nodesList: resObj.main.nodesList,
          baseParent: resObj.main.nodeParent
        });
      });
      return self._set_firstUnitBasic(resObj.main.nodesList);
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

  _handleClick_switchStartList(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {
        atStartListify: prevState.atStartListify ? false : true,
        baseNode: prevState.atStartListify ? this.props.startNode: null,
        baseParent: null
      };
    });
  }

  _handleClick_switchUppeLayer(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.state.baseParent) return; // 'null', when no parent fr baseNode

    this.setState({
      baseNode: this.state.baseParent,
      baseParent: null
    });
  }

  _handleClick_filterNode(event){
    // nor stopPropagation neither preventDefault here
    // to make the <Link> work as expect
    this.props._handle_nodeClick();
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
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
)(NodesFilter));
