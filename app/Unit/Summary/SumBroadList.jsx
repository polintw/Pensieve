import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class SumBroadList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onAct: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleEnter_act = this._handleEnter_act.bind(this);
    this._handleLeave_act = this._handleLeave_act.bind(this);
    this._axios_post_actionBroad = this._axios_post_actionBroad.bind(this);
    this.style={

    };
  }

  _handleEnter_act(e){
    this.setState({
      onAct: true
    })
  }

  _handleLeave_act(e){
    this.setState({
      onAct: false
    })
  }

  _axios_post_actionBroad(){
    const self = this;
    this.setState({axios: true});

    axios.post('/router/broad/'+this.props.unitCurrent.unitId, {}, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      self.setState({axios: false});
      //submit change to reducer
      self.props._submit_Broad_status({broad: true});
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    return(
      <div
        className={classnames(styles.comSum_BroadList)}>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SumBroadList));
