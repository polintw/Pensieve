import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import PasswordForm from '../../Components/PasswordForm.jsx';
import {
  setSignInit
} from "../../redux/actions/sign.js";
import {
  setMessageSingle
} from "../../redux/actions/general.js";

class PasswordReset extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_success = this._submit_success.bind(this);
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

  _submit_success(){
    this.props._submit_SingleDialog({
      render: true,
      message: [{text:this.props.i18nUIString.catalog['message_Resend_PassReset'],style:{}}],
      handlerPositive: ()=>{window.location.assign('/')},
      buttonValue: 'Sing in'
    });

  }

  componentDidMount() {

  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        style={this.style.SignupMailresend_}>
          <h2>
            { this.props.i18nUIString.catalog["title_Sign_pwReset"]}</h2>
          <PasswordForm
            {...this.props}
            pwreset={true}
            _submit_success={this._submit_success}/>

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
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_StateInit: ()=>{dispatch(setSignInit());},
    _submit_SingleDialog: (obj)=>{dispatch(setMessageSingle(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordReset));
