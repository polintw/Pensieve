import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../stylesFont.module.css";
import {mountUserInfo} from '../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class StartBtn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      mouseOnStart: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_patchUserStatus = this._axios_patchUserStatus.bind(this);
    this._handleEnter_newlyStart = this._handleEnter_newlyStart.bind(this);
    this._handleLeave_newlyStart = this._handleLeave_newlyStart.bind(this);
    this._handleClick_onBoardComplete = this._handleClick_onBoardComplete.bind(this);
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.boxNewly)}>
        <span
          className={classnames(
            styles.spanNewly,
            stylesFont.colorEditLightBlack, stylesFont.fontContent)}>
            {this.props.i18nUIString.catalog['hint_onBoard_start']}
        </span>
        <div
          className={classnames(
            styles.boxBtnStart,
            {[styles.boxBtnStartMouseOn]: (this.state.mouseOnStart && !this.state.axios)}
          )}
          onClick={this._handleClick_onBoardComplete}
          onMouseEnter={this._handleEnter_newlyStart}
          onMouseLeave={this._handleLeave_newlyStart}>
          <span
            className={classnames(
              stylesFont.fontSubmit ,
              stylesFont.colorWhite)}>
              {this.props.i18nUIString.catalog["submit_onBoard_start"]}
          </span>
        </div>
      </div>
    )
  }

  _handleClick_onBoardComplete(e){
    e.preventDefault();
    e.stopPropagation();
    if(this.state.axios) return; // still under tansmit

    const self = this;
    this.setState({axios: false});

    this._axios_patchUserStatus()
    .then(()=>{
      //after patch, we just reset local state to refresh the index
      this.props._set_userInfo({accountStatus: 'active'});
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

  _handleEnter_newlyStart(e){
    this.setState({mouseOnStart: true})
  }

  _handleLeave_newlyStart(e){
    this.setState({mouseOnStart: false})
  }

  _axios_patchUserStatus(){
    return axios({
      method: 'patch',
      url: '/router/register/onboard',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
    .then(function (resObj) {
      return true;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_userInfo: (obj)=>{dispatch(mountUserInfo(obj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(StartBtn));
