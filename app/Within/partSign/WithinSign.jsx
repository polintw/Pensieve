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
import IndexUnsignWrapper from './IndexUnsign/Wrapper.jsx';
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
    this._signup_success = this._signup_success.bind(this);
    this._render_SignandIndex = this._render_SignandIndex.bind(this);
  }

  _signup_success(){
    this.props.history.replace({
      pathname: this.props.location.pathname + "/success", // '/signup' + '/success'
      state: { from: this.props.location }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let prevUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    let processSigninify = urlParams.has('process'); // currently only tab 'signin'
    let processPrevSigninify = prevUrlParams.has('process'); // currently only tab 'signin'
    if (processSigninify && !processPrevSigninify) {
      window.scrollTo(0, 0);
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_SignandIndex(){
    const _signin_success = ()=>{
      let urlParamsSuccess = new URLSearchParams(this.props.location.search); //we need value in URL query
      if(urlParamsSuccess.has('process')) urlParamsSuccess.delete("process");
      let url = this.props.location.pathname+ urlParamsSuccess;
      window.location.reload(url);
    };
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let processTab = '';
    if(urlParams.has('process')){
      processTab = urlParams.get('process');
    } else processTab = null;

    if(
      processTab == "signin" ||
      this.props.location.pathname.includes('/confirm') ||
      this.props.location.pathname.includes('/signup')){
      return (
        <div
          className={classnames(styles.boxSignProcess)}>
          <div
            className={classnames(styles.boxForm)}
            style={ (
              this.props.location.pathname.includes('/confirm') ||
              this.props.location.pathname.includes('/signup/success')
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
              <Route path={"/"} render={(props) =>{
                  return (
                    <div>
                      <SigninForm {...props} _signin_success={_signin_success} />
                      <div
                        className={classnames(styles.boxIntro)}>
                        <span
                          className={classnames("colorSignBlack", "fontTitle")}
                          style={{display: 'inline-block'}}>
                          {this.props.i18nUIString.catalog["message_Signin_intro"][0]}
                        </span>
                        <span
                          className={classnames("colorSignBlack", "fontSubtitle")}
                          style={{display: 'inline-block', maxWidth: '200px'}}>
                          {this.props.i18nUIString.catalog["message_Signin_intro"][1]}
                        </span>
                      </div>
                    </div>
                  )
                }}/>
            </Switch>
          </div>
        </div>
      )
    }
    else {
      return <IndexUnsignWrapper {...this.props}/>
    };
  }

  render(){
    return(
      <div
        className={styles.comWithinSign}>
        {this._render_SignandIndex()}
      </div>
    )
  }

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
