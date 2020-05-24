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
import InvitationFellow from './InvitationFellow.jsx';
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
    this._signin_success = this._signin_success.bind(this);
    this._signup_success = this._signup_success.bind(this);
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
    // the "invitation" would only display after page load, so process here
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let invitationify = !!params.get('invitation') ? params.get('invitation') : false;
    if(invitationify) {

    };
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

          {
            this.state.invitation &&
            <InvitationFellow
              {...this.props}/>
          }
          <Switch>
            <Route path={ "/confirm"} render={(props) => <Confirmation {...props} />} />
            <Route path={ "/signup/success"} render={(props) => <SignupSuccess {...props} />} />
            <Route path={"/signup"} render={(props) => <SignupForm {...props} _signin_success={this._signup_success} />}/>
            <Route path={this.props.match.path} render={(props) => <SigninForm {...props} _signin_success={this._signin_success} />}/>
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
