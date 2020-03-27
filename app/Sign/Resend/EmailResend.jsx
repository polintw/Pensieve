import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from '../utils/errHandler_axios.js';
import {
  axiosGetRes,
  setSignInit
} from "../../redux/actions/sign.js";
import {
  axiosSwitch,
} from "../../redux/actions/general.js";

class EmailResend extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: ""
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handle_Mailresend = this._handle_Mailresend.bind(this);
    this.style={
      SignupMailresend_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Mailresend_form_: {
        width: '40%',
        height: '70%',
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing:'border-box'
      }
    }
  }

  _handle_Mailresend(event){
    event.preventDefault();
    if(this.props.axios) return; //prevent repeated request
    const self = this;
    let reqBody = {
      'email': this.state.email
    };
    let url = (this.purpose == 'verifications')? '/router/register/mail/resend' : '/router/account/password?forget';

    this.props._set_axiosStatus(true);
    axios.patch(url, reqBody, {
      headers: {
        'charset': 'utf-8'
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown, self.props);
      } else {
        uncertainErr(thrown, self.props);
      }
    });
  }

  _handleChange_Input(event) {
    //the value of event target would convert into String, no matter what type in original options/inputs
    this.setState({
        [event.target.name]: event.target.value
    })
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

    const message = this.props.message;
    return(
      <div
        style={this.style.SignupMailresend_}>
          <h2>
            {
              (this.purpose == "verifications") ? (
                this.props.i18nUIString.catalog["title_Sign_mailResend"][0]
              ):(
                this.props.i18nUIString.catalog["title_Sign_mailResend"][1]
              )

            }</h2>
          <form onSubmit={this._handle_Mailresend}>
            {'email:'}<br/>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={ this._handleChange_Input }
              value={ this.state.email }/><br/>
              {
                message.email &&
                <div>{message.email}</div>
              }
              <br/>
              {
                message.warning &&
                <div>{message.warning}</div>
              }
              <input
                type='submit'
                value={this.props.i18nUIString.catalog["link_Sign_resendButton"]}
                disabled={this.props.axios? true:false}/>
            </form>
          <div
            style={{display:'flex',justifyContent: 'space-around',width: '50%',margin:'2rem 0',float:'right'}}>
            <a
              href="/"
              target="_self"
              className={classnames(
                'plainLinkButton'
              )}
              style={{margin: '5rem, 0', display: 'block'}}>
              <span
                className={classnames(
                  styles.spanSignIn,
                )}>
                {"Sign in"}</span>
            </a>
            <Link
              to="/signup"
              className={classnames('plainLinkButton')}
              style={{margin: '5rem, 0', display: 'block'}}>
              <span
                className={classnames(
                  styles.spanSignIn,
                )}>
                {"Sign up"}</span>
            </Link>
          </div>
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
