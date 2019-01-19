import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import SignupForm from './SignupForm.jsx';
import {
  axiosSwitch,
  axiosGetRes,
  handleSignUser
} from "../../redux/actions/handleSign.js";

class SignupSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      SignupSuccess_: {
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

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.SignupSuccess_}>
        <div>
          <p>{"You've already sign up."}</p>
          <p>{"The World has been there, but"}</p>
          <p>{"completing the process by verifing your Email Adress!"}</p>
          <Link
            to="/signin">
            <span>{"Sign in"}</span>
          </Link>
        </div>
      </div>
    )
  }
}

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Signup_: {
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

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Signup_}>
        <Switch>
          <Route path="/success" render={(props)=> <SignupSuccess {...props}/>}/>
          <Route path="/" render={(props)=> <SignupForm {...props}/>}/>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_Signin: (submitObj)=>{dispatch(handleSignUser(submitObj));},
    _set_axiosStatus: (bool)=>{dispatch(axiosSwitch(bool));},
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));
