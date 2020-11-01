import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nodesList: [],
      baseNode: null,
      fetchify: false,
    };
    this._render_Nodes = this._render_Nodes.bind(this);
    this._set_nodesList = this._set_nodesList.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if ((this.props.startList != prevProps.startList) || (this.props.startNode != prevProps.startNode)) {
      /*
      it's, the situation the whole page was redirect,
      or the data finally fetched from server.
      */
      return {
        nodesList: this.props.startList,
        baseNode: this.props.startNode,
        fetchify: !this.props.startListify
      };
    };
    if(this.state.fetchify){ // going to fetch the new list by baseNode
      this.setState({
        fetchify: false
      });
      this._set_nodesList(this.state.baseNode);
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Nodes(){
    let nodesListDOM = this.nodesList.map((nodeId, index)=>{
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
        {this._render_Nodes()}
      </div>
    )
  }

  _set_nodesList(baseNode){
    const self = this;
    this.setState({axios: true});

    _axios_get_NodesLayer(this.axiosSource.token, {
      baseNode: baseNode
    })
    .then((resObj)=>{
      if(resObj.main.unitsList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState.feedList.slice();
          copyList.push(resObj.main.unitsList);
          return {
            feedList: copyList,
            scrolled: resObj.main.scrolled
          }
        });

        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList);
      }
      else{
        self.setState({scrolled: resObj.main.scrolled}) // don't forget set scrolled to false to indicate the list was end
        return { //just a way to deal with the next step, stop further request
          main: {
            nounsListMix: [],
            usersList: [],
            unitsBasic: {},
            marksBasic: {}
          }}};
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesFilter));
