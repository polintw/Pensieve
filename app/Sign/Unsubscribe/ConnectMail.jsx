import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SigninForm from '../components/SigninForm/SigninForm.jsx';
import NavHome from '../components/NavHome/NavHome.jsx';
import MessageInput from '../components/MessageInput/MessageInput.jsx';
import {
  setSignInit
} from "../../redux/actions/sign.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_StateInit: ()=>{dispatch(setSignInit());},
  }
}

const reduxConnection = connect( // in order to connect both class comp in this file
  mapStateToProps,
  mapDispatchToProps
);

class BtnMailUnsub extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false,
      onEnterDelete: false
    };
    this._handleClick_unsubConfirm = this._handleClick_unsubConfirm.bind(this);
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleEnter_Delete = this._handleEnter_Delete.bind(this);
    this._handleLeave_Delete = this._handleLeave_Delete.bind(this);
  }

  render(){
    return (
      <div style={{display:'flex'}}>
        <div
          className={classnames(styles.btnSubmit)}
          style={Object.assign({},
            {marginRight: '10px'},
            (this.state.onEnterDelete )? {backgroundColor: "#757575", cursor: 'pointer'}:{}
          )}
          onClick={()=>{ window.location.assign('/'); /* to home */}}
          onMouseEnter={this._handleEnter_Delete}
          onMouseLeave={this._handleLeave_Delete}>
          <span
            className={classnames(
              'centerAlignChild', "fontContent",
              {["colorEditBlack"]: !this.state.onEnterDelete},
              {["colorWhite"]: this.state.onEnterDelete}
            )}>
            {this.props.i18nUIString.catalog["submit_cancel"]}
          </span>
        </div>
        <div
          className={classnames(styles.btnSubmit)}
          style={Object.assign({},
            (this.state.onEnterSubmit && !this.props.axios)? {backgroundColor: "#ff8168", cursor: 'pointer'}:
            {backgroundColor: 'rgba(255, 129, 104, 0.1)'}
          )}
          onClick={this._handleClick_unsubConfirm}
          onMouseEnter={this._handleEnter_Submit}
          onMouseLeave={this._handleLeave_Submit}>
          <span
            className={classnames(
              'centerAlignChild', "fontContent",
              {["colorStandard"]: (!this.state.onEnterSubmit && !this.props.axios)},
              {["colorWhite"]: (this.state.onEnterSubmit || this.props.axios)}
            )}>
            {this.props.i18nUIString.catalog["submit_yes"]}
          </span>
        </div>

      </div>
    )
  }

  _handleClick_unsubConfirm(e){
    e.stopPropagation();
    e.preventDefault();
    this.props._set_unsub();
  }

  _handleEnter_Submit(e){
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    this.setState({
      onEnterSubmit: false
    })
  }

  _handleEnter_Delete(e){
    this.setState({
      onEnterDelete: true
    })
  }

  _handleLeave_Delete(e){
    this.setState({
      onEnterDelete: false
    })
  }
}

const BtnUnsubSet = reduxConnection(BtnMailUnsub);

class ConnectMail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      view: 'init',
      resMessage: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._patch_unsubMail = this._patch_unsubMail.bind(this);
    this._render_unsubscribeMail = this._render_unsubscribeMail.bind(this);
    this.style={
      SignupMailresend_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-end",
        width: "385px",
        maxWidth: "98vw",
        paddingTop: "12vh",
      },
      ConfirmSuccess_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {
    // checking the token existence
    if(!window.localStorage['token']){
      this.setState({view: 'unsigned'});
    }
    else{ // has token
      this.setState({view: 'confirm'});
    }
  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  _render_unsubscribeMail(){
    switch (this.state.view) {
      case "complete":
        return (
          <div
            style={this.style.ConfirmSuccess_}>
            <div
              className={classnames("fontContent", "colorSignBlack")}
              style={{ marginBottom: "7.6vh"}}>
              <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail_complete"][0]}</p>
              <br/>
              <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail_complete"][1]}</p>
            </div>
            <div
              className={classnames(styles.boxBtn)}>
              <NavHome/>
            </div>
          </div>
        )
        break;
      case "confirm":
        return (
          <div
            style={this.style.ConfirmSuccess_}>
            <div
              style={{ marginBottom: "7.6vh"}}>
              <div
                className={classnames("fontContent", "colorSignBlack")}>
                <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail"][0]}</p>
                <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail"][1]}</p>
              </div>
              {
                this.state.resMessage.warning &&
                <div
                  className={classnames(styles.boxWarning)}>
                  <MessageInput
                    messageIcon={"error"}
                    messageText={this.state.resMessage.warning}/>
                </div>
              }
            </div>
            <div
              className={classnames(styles.boxBtn)}>
              <BtnUnsubSet
                axios={this.state.axios}
                _set_unsub={this._patch_unsubMail}/>
            </div>
          </div>
        )
        break;
      case "unsigned":
        return (
          <div>
            <div
              className={classnames(styles.boxWarning)}>
              <MessageInput
                messageIcon={false}
                messageText={this.props.i18nUIString.catalog["message_Sign_UnsubMail_noToken"]}/>
            </div>
            <SigninForm
              {...this.props}
              _signin_success={()=>{window.location.reload();} } />
          </div>
        )
        break;
      default:
        return null // basically the init state
    }
  }

  render(){
    return(
      <div
        style={this.style.SignupMailresend_}>
        <div
          style={{marginBottom: '3rem'}}>
          <span
            className={classnames("fontTitle", "colorBlack85")}>
            {this.props.i18nUIString.catalog["title_Sign_UnsubMail"]}
          </span>
        </div>
        {this._render_unsubscribeMail()}
      </div>
    )
  }

  _patch_unsubMail(){
    this.setState({axios: true});
    const self = this;

    axios({
      method: 'patch',
      url: '/router/account/setting/notifiedMail',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        'purpose': 'unsubscribe'
      },
      cancelToken: this.axiosSource.token
    }).then((res)=> {
      self.setState({
        axios: false,
        view: 'complete'
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) self.setState({resMessage: message});
      }
    });
  }
}

export default withRouter(reduxConnection(ConnectMail));
