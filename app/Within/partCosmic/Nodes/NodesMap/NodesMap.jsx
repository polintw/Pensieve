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
import MapUnit from '../../../../Components/Map/MapUnit.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class NodesMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      markersUsed: []
    };
    this.axiosSource = axios.CancelToken.source();
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comNodes)}>
        <MapNodes
          coordCenter={[0, 60]}
          markers={/*[
            {
            nodeid:,
            coordinates:,
            additional: {
              latestUsed: time,
              firstUser: {}
            }
            }
          ]
          */}
          zoomLevel={1}
          _handleClick_popupMainImg={()=>{this._set_frameView('img')}}/>
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
          markersUsed:
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
