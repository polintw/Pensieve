import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import MessageInput from '../components/MessageInput/MessageInput.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';
import {
  axiosGetRes,
  setSignInit
} from "../../redux/actions/sign.js";
import {
  axiosSwitch,
} from "../../redux/actions/general.js";

const emailValidation = (emailValue)=>{ return emailValue.checkValidity(); } //js f(), would return bool by result of validation

class EmailResend extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      greenlight: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handle_Mailresend = this._handle_Mailresend.bind(this);
  }

  _handle_Mailresend(event){
    event.preventDefault();
    if(this.props.axios) return; //prevent repeated request
    const self = this;
    let reqBody = {
      'email': this.state.email
    };
    let url = (this.purpose == 'verifications')? '/router/register/mail/resend' : '/router/forget/password';

    this.props._set_axiosStatus(true);
    axios.patch(url, reqBody, {
      headers: {
        'charset': 'utf-8'
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
    }).catch(function (thrown) {
      self.props._set_axiosStatus(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) self.props._set_axiosRes({axiosStatus: false, message: (typeof message == 'string') ? {"warning": message}: message});
      }

    });
  }

  _handleChange_Input(event) {
    let obj={};
    obj[event.currentTarget.name] = event.currentTarget.value;
    obj['greenlight'] =  emailValidation(event.currentTarget) ? true : false;
    // we also check if going to reset message
    if(event.currentTarget.name in ((typeof this.props.message != "string") ? this.props.message : {})) {
      let messageObj = {};
      messageObj[event.currentTarget.name] = "";
      this.props._set_axiosRes({message: messageObj});
    };
    this.setState(obj);
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    };
    this.props._set_StateInit()
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.purpose = params.get('purpose');

    const submitPermission = ( !this.props.axios && this.state.greenlight )? true : false;
    const message = this.props.message;
    return(
      <div
        className={styles.comResendMail}>
        <div
          style={{marginBottom: '3rem'}}>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorBlack85)}>
            {
              (this.purpose == "verifications") ? (
                this.props.i18nUIString.catalog["title_Sign_mailResend"][0]
              ):(
                this.props.i18nUIString.catalog["title_Sign_mailResend"][1]
              )
            }
          </span>
        </div>
        <form onSubmit={this._handle_Mailresend}
          style={{width: '100%'}}>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {this.props.i18nUIString.catalog["subtitle_Sign_emailResend"]}
          </span>
          <div
            className={classnames(styles.boxInput)}>
            <input
              type="email"
              placeholder="example@mail.com"
              name="email"
              required
              className={classnames(
                'plainInputText',
                styles.inputSign, stylesFont.fontContent, stylesFont.colorBlack85,
                {[styles.inputSignError]: message.email}
              )}
              value={this.state.email}
              onChange={this._handleChange_Input}/>
            {
              message.email &&
              <div
                className={classnames(styles.boxInputMes)}>
                <MessageInput
                  messageIcon={"error"}
                  messageText={message.email}/>
              </div>
            }
          </div>
          {
            message.warning &&
            <div
              className={classnames(styles.boxWarning)}>
              <MessageInput
                messageIcon={false}
                messageText={message.warning}/>
            </div>
          }
          <input
            type='submit'
            value={this.props.i18nUIString.catalog["submit_"]}
            disabled={submitPermission? false: true}
            className={classnames(
              'plainInput',
              styles.boxSubmit,
              {[styles.boxSubmitAllow]: submitPermission},
              stylesFont.colorWhite, stylesFont.fontSubtitle)}/>

        </form>
      </div>

    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_axiosStatus: (bool)=>{dispatch(axiosSwitch(bool));},
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));},
    _set_StateInit: ()=>{dispatch(setSignInit());}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailResend));
