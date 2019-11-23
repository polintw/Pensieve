import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {setUnitBroad} from '../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class ActionBroad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onAct: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleEnter_act = this._handleEnter_act.bind(this);
    this._handleLeave_act = this._handleLeave_act.bind(this);
    this._handleClick_Broad = this._handleClick_Broad.bind(this);
    this._axios_post_actionBroad = this._axios_post_actionBroad.bind(this);
    this._axios_patch_actionBroad = this._axios_patch_actionBroad.bind(this);
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

  _axios_patch_actionBroad(){
    const self = this;
    this.setState({axios: true});

    axios.patch('/router/broad/'+this.props.unitCurrent.unitId, {}, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      self.setState({axios: false});
      //submit change to reducer
      self.props._submit_Broad_status({broad: false});

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

  _handleClick_Broad(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.props.unitCurrent.broad) this._axios_patch_actionBroad()
    else this._axios_post_actionBroad();
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
        className={classnames(styles.comActionBroad)}
        style={Object.assign(
          {},
          {cursor: 'pointer'},
          this.state.onAct? {color: '#FAFAFA'}:{color: 'rgba(250,250,250,0.5)'},
          this.props.unitCurrent.broad? {color: '#FAFAFA'}:{color: 'rgba(250,250,250,0.5)'}
        )}
        onClick={this._handleClick_Broad}
        onMouseEnter={this._handleEnter_act}
        onMouseLeave={this._handleLeave_act}>
        <span
          className={classnames()}>
          {"Broad"}
        </span>
        <span
          className={classnames()}>
          {"cast"}
        </span>
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
    _submit_Broad_status: (obj) => { dispatch(setUnitBroad(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionBroad));
