import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SigninForm from '../../Sign/components/SigninForm/SigninForm.jsx';
import SignupForm from '../../Sign/components/SignupCom/SignupForm.jsx';
import SignupSuccess from '../../Sign/components/SignupCom/SignupSuccess.jsx';
import Confirmation from '../../Sign/components/Confirmation/Confirmation.jsx';
import NavSign from '../../Sign/components/NavSign/NavSign.jsx';


class WithinSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._switch_Sign = this._switch_Sign.bind(this);
    this._signin_success = this._signin_success.bind(this);
    this._signup_success = this._signup_success.bind(this);
  }

  _switch_Sign(aim){
    switch (aim) {
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
    this.props.history.replace({
      pathname: this.props.match.path + "/signup/success",
      state: { from: this.props.location }
    });
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={styles.comWithinSign}>
        <div
          className={classnames(styles.boxForm)}
          style={this.props.location.pathname.includes('/success') ? {flexDirection: 'column-reverse'}:{}}>
          <div
            className={classnames(styles.boxNav)}>
            <NavSign
              {...this.props}/>
          </div>
          <Switch>
            <Route path={ "/confirm"} render={(props) => <Confirmation {...props} _switch_Sign={this._switch_Sign} />} />
            <Route path={ "/signup/success"} render={(props) => <SignupSuccess {...props} _switch_Sign={this._switch_Sign} />} />
            <Route path={"/signup"} render={(props) => <SignupForm {...props} _switch_Sign={this._switch_Sign} _signin_success={this._signup_success} />}/>
            <Route path={this.props.match.path} render={(props) => <SigninForm {...props} _switch_Sign={this._switch_Sign} _signin_success={this._signin_success} />}/>
          </Switch>
        </div>

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
