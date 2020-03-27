import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SigninForm from '../../Sign/components/SigninForm/SigninForm.jsx';
import SignupForm from '../../Sign/components/SignupCom/SignupForm.jsx';
import SignUpSuccess from '../../Sign/components/SignupCom/SignUpSuccess.jsx';

class WithinSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      steps: 'signin'
    };
    this._switch_Sign = this._switch_Sign.bind(this);
    this._signin_success = this._signin_success.bind(this);
    this._render_signInDialog = this._render_signInDialog.bind(this);
  }

  _switch_Sign(aim){
    switch (aim) {
      case 'toSignIn':
        this.setState({steps: 'signin'})
        break;
      case 'toSignUp':
        this.setState({steps: 'signup'})
        break;
      case 'toSignUpSuccess':
        this.setState({steps: 'signupsuccess'})
        break;
      case 'toMailResend':
        window.location.assign('/s/resend?purpose=verifications');
        break;
      case 'toForgetPw':
        window.location.assign('/s/resend?purpose=password');
        break;
      default:
        null
    }
  }

  _signin_success(){
    window.location.reload();
  }

  _signup_success(){
    this._switch_Sign('toSignUpSuccess')
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_signInDialog(){
    switch (this.state.steps) {
      case 'signin':
        return (
          <div>
            <SigninForm
              {...this.props}
              _switch_Sign={this._switch_Sign}
              _signin_success={this._signin_success}/>
          </div>
        )
        break;
      case 'signup':
        return (
          <div>
            <SignupForm
              {...this.props}
              _switch_Sign={this._switch_Sign}
              _signup_success={this._signup_success}/>
          </div>
        )
        break;
      case 'signupsuccess':
        return (
          <div>
            <SignUpSuccess
              {...this.props}
              _switch_Sign={this._switch_Sign}/>
          </div>
        )
        break;
      default:
        return
    }
  }

  render(){
    return(
      <div
        className={styles.comWithinSign}>
        {this._render_signInDialog()}

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(WithinSign));
