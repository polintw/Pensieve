import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {_axios_get_usedNodes} from '../axios.js';
import MapNodes from '../../../../Components/Map/MapNodes.jsx';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class NodesMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      markersUsed: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_usedNodes = this._fetch_usedNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._fetch_usedNodes();
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comNodes)}>
        <MapNodes
          coordCenter={[20, 0]}
          markers={
            this.state.markersUsed
            /*[
            {
            nodeid:,
            coordinates:,
            additional: {
              accumulatedCount: ,
              latestUsed: time,
              firstUser: {}
            }
            }
          ]
          */}
          minZoomLevel={1}
          zoomLevel={1.5}/>
      </div>
    )
  }

  _fetch_usedNodes(){
    const self = this;
    this.setState({axios: true});

    _axios_get_usedNodes(this.axiosSource.token)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          markersUsed:resObj.main.nodesDataList
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
    userInfo: state.userInfo,
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
)(NodesMap));
