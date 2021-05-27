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
    this._compPathPlain = this._compPathPlain.bind(this);
    this._signup_success = this._signup_success.bind(this);
  }

  _signup_success(){
    this.props.history.replace({
      pathname: this.props.location.pathname + "/success", // '/signup' + '/success'
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
          style={ (
            //(this.props.location.pathname =="/" && this.props.location.search.length==0) ||
            //this.props.location.pathname=="/signup" ) ? // only Sign in /up was at the top
            this.props.location.pathname.includes('/resend') ||
            this.props.location.pathname.includes('/confirm') ||
            this.props.location.pathname.includes('/signup/success') ||
            this.props.location.search.includes('invitation')
            ) ?
            {flexDirection: 'column-reverse'}:
            {}}>
          <div
            className={classnames(styles.boxNav)}>
            <NavSign
              {...this.props}/>
          </div>

          <Switch>
            <Route path={ "/confirm"} render={(props) => <Confirmation {...props} />} />
            <Route path={ "/signup/success"} render={(props) => <SignupSuccess {...props} />} />
            <Route path={"/signup"} render={(props) => <SignupForm {...props} _signup_success={this._signup_success} />}/>
            <Route path={this.props.match.path} component={this._compPathPlain}/>
          </Switch>
        </div>

      </div>
    )
  }

  _compPathPlain ( props ){
    let params = new URLSearchParams( props.location.search); //we need value in URL query
    return SigninWrapper( props, this);
  }
}

const SigninWrapper = ( props, parent) => {
  const _signin_success = ()=>{
    let url = props.location.pathname+ props.location.search;
    window.location.reload(url);
  }

  return (
    <div>
      <SigninForm {...props} _signin_success={_signin_success} />
      <div
        className={classnames(styles.boxIntro)}>
        <span
          className={classnames("colorSignBlack", "fontTitle")}
          style={{display: 'inline-block'}}>
          {parent.props.i18nUIString.catalog["message_Signin_intro"][0]}
        </span>
        <span
          className={classnames("colorSignBlack", "fontSubtitle")}
          style={{display: 'inline-block', maxWidth: '200px'}}>
          {parent.props.i18nUIString.catalog["message_Signin_intro"][1]}
        </span>
      </div>
    </div>
  )
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(WithinSign));
