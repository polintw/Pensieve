import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import MapCorner from './MapCorner.jsx';
import {
  _axios_GET_feed_Fellows
} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";

class FellowsHome extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      cornersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_corners = this._render_corners.bind(this);
    this._init_fetch = this._init_fetch.bind(this);
  }


  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    _axios_GET_feed_Fellows(
      this.axiosSource.cancelToken,
      this.props.belongsByType['homeland'],
      {baseCat: 'homeland', curiousArr: ['residence']}
    )
    .then((resObj)=>{
      const nodesList= resObj.main.nodesList;
      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action

      self.setState({
        axios: false,
        cornersList: nodesList
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
    if(prevProps.belongsByType.homeland != this.props.belongsByType.homeland && !!this.props.belongsByType.homeland){
      this._init_fetch();
    }
  }

  componentDidMount(){
    this._init_fetch()
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_corners(){
    let listDOM = this.state.cornersList.map((nodeId, index)=>{
      return (
        <div
          key={"_key_fellowsHomeCorners_"+index}
          style={{margin: "0 1vw"}}>
          <MapCorner
            nodeId={nodeId}
            typeNodeId={this.props.belongsByType['homeland']}
            currentType={'homeland'}
            typeReverse={'residence'}/>
        </div>
      )
    });

    return listDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comTabView)}>
        {this._render_corners()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
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
)(FellowsHome));
