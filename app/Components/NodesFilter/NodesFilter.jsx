import React from 'react';
import {
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
      atStartListify: true
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Nodes = this._render_Nodes.bind(this);
    this._set_nodesList = this._set_nodesList.bind(this);
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
    let list = (this.props.startListify && this.state.atStartListify) ? this.props.startList : this.state.nodesList;
    let nodesListDOM = list.map((nodeId, index)=>{
      return (
        <div>
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
        </div>
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
        </div>
        <div>
          {this._render_Nodes()}
        </div>
      </div>
    )
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
        baseNode: prevState.atStartListify ? this.props.startNode: null
      };
    });
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
