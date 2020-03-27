import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ServiceLinks from '../../Components/ServiceLinks.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';

const commonStyle= {
  signLogo: {
    display: 'inline-block',
    width: '10vw',
    minHeight: '27px',
    position: 'absolute',
    left: '0%',
    top: '25%',
    boxSizing: 'border-box',
    transform: 'rotate(270deg)'
  }
}

class ConfirmSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSignIn: false
    };
    this._handleMouseOn_signIn = ()=> this.setState((prevState,props)=>{return {onSignIn: prevState.onSignIn?false:true}});
    this.style={
      ConfirmSuccess_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.ConfirmSuccess_}>
        <div
          className={classnames(styles.fontContent)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Success"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Success"][1]}</p>
          <a
            href="/"
            target="_self"
            purpose="signup"
            className={classnames('plainLinkButton')}
            style={{margin: '5rem, 0', display: 'block'}}
            onMouseEnter={this._handleMouseOn_signIn}
            onMouseLeave={this._handleMouseOn_signIn}>
            <span
              className={classnames(
                styles.spanSignIn,
                {[styles.spanSignInMouse]: this.state.onSignIn}
              )}>
              {"Sign in"}</span>
          </a>
        </div>
      </div>
    )
  }
}

class ConfirmFail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false
    };
    this.style={
      ConfirmFail_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  _handleEnter_CornerOpt(e){
    this.setState({
      mouseOn: e.currentTarget.attributes.purpose.value
    })
  }

  _handleLeave_CornerOpt(e){
    this.setState({
      mouseOn: ''
    })
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.ConfirmFail_}>
        <div>
          <div
            className={classnames(styles.fontContent)}>
            <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][0]}</p>
            <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][1]}</p>
            <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][2]}</p>

            <Link
              to="/resend?purpose=verifications"
              purpose="email"
              className={classnames('plainLinkButton')}
              style={{margin: '5rem, 0', display: 'block'}}
              onMouseEnter={this._handleEnter_Links}
              onMouseLeave={this._handleLeave_Links}>
              <span
                className={classnames(
                  styles.spanSignIn,
                  {[styles.spanSignInMouse]: this.state.mouseOn =="email"}
                )}>
                {this.props.i18nUIString.catalog["link_Sign_mailResend"]}</span>
            </Link>
            <a
              href="/"
              target="_self"
              purpose="signup"
              className={classnames('plainLinkButton')}
              style={{margin: '5rem, 0', display: 'block'}}
              onMouseEnter={this._handleEnter_Links}
              onMouseLeave={this._handleLeave_Links}>
              <span
                className={classnames(
                  styles.spanSignIn,
                  {[styles.spanSignInMouse]: this.state.mouseOn =="signin"}
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
      </div>
    )
  }
}

/*
if the 2 class above did "not" connect to redux,
it could not get i18nUIString or other props from parent comp (class Confirmation).
we have to connect them directly.
*/
const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message,
    i18nUIString: state.i18nUIString,
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

const Success = reduxConnection(ConfirmSuccess);
const Fail = withRouter(reduxConnection(ConfirmFail));

class Confirmation extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this.style={
      Confirmation_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      boxContent: {
        width: '20vw',
        position: 'absolute',
        top: '13%',
        right: '0',
        boxSizing:'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Confirmation_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={commonStyle.signLogo}>
            <SvgLogo/>
          </div>
          <div
            style={this.style.boxContent}>
            <Route path={this.props.match.path+"/success"} render={(props)=> <Success {...props}/>}/>
            <Route path={this.props.match.path+"/fail"} render={(props)=> <Fail {...props}/>}/>
          </div>
          <div
            className={classnames(styles.boxServiceLink)}>
            <ServiceLinks/>
          </div>
        </div>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation));
