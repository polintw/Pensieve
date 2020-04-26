import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import InvitationFellow from './InvitationFellow.jsx';
import SigninForm from '../../Sign/components/SigninForm/SigninForm.jsx';
import SignupForm from '../../Sign/components/SignupCom/SignupForm.jsx';
import SignupSuccess from '../../Sign/components/SignupCom/SignupSuccess.jsx';

class WithinSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      steps: ''
    };
    this._switch_Sign = this._switch_Sign.bind(this);
    this._signin_success = this._signin_success.bind(this);
    this._signup_success = this._signup_success.bind(this);
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
      case 'toInvitation':
        this.setState({steps: 'invitation'})
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
    let url = this.props.location.pathname+this.props.location.search;
    window.location.reload(url);
  }

  _signup_success(){
    this._switch_Sign('toSignUpSuccess')
  }

  componentDidMount() {
    // the "invitation" would only display after page load, so process here
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let invitationify = !!params.get('invitation') ? params.get('invitation') : false;
    if(invitationify) {this._switch_Sign("toInvitation");}
    else{
      this._switch_Sign('toSignIn');
    };
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
            <SignupSuccess
              {...this.props}
              _switch_Sign={this._switch_Sign}/>
          </div>
        )
        break;
      case 'invitation':
        return (
          <div>
            <InvitationFellow
              {...this.props}
              _switch_Sign={this._switch_Sign}/>
          </div>
        )
        break;
      default:
        return null
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
