import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CornersItem from './CornersItem.jsx';
import {
  _axios_GET_OptionsRecomCorners
} from "./utils.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../../redux/actions/general.js";


class CornersRecom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._init_fetch = this._init_fetch.bind(this);
    this._render_RecomList = this._render_RecomList.bind(this);

  }

  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    _axios_GET_OptionsRecomCorners(this.axiosSource.token)
    .then((resObj)=>{
      //not set state.axios back to 'true' because we are going to next axios not far away
      self.props._submit_NounsList_new(resObj.main.nodesList); //GET nodes info by Redux action
      self.props._submit_Corners_count(resObj.main.nodesList); //GET count of each node display, by Redux action as well.

      self.setState((prevState, props)=>{
        return({
          nodesList: resObj.main.nodesList
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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._init_fetch();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_RecomList(){
    const nodesDOM = this.state.nodesList.map((nodeId, index)=>{
      return (
        <div
          key={"key_CornersItem_"+index}>
          <CornersItem
            _refer_von_cosmic={this.props._refer_von_cosmic}/>
        </div>
      )
    });

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comCornersRecom)}>
        {this._render_RecomList()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_Corners_count: (arr) => { dispatch(); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CornersRecom));
