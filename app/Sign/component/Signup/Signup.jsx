import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  SignupMailresend,
  SignupSuccess
} from '../SignupCom/SignupCom.jsx';
import SignupForm from '../SignupCom/SignupForm.jsx';
import ServiceLinks from '../../../Components/ServiceLinks.jsx';
import {
  setSignInit,
} from "../../../redux/actions/sign.js";

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false
    };
    this._signup_success = this._signup_success.bind(this);
    this.style={
      Signup_: {
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

  _signup_success(){
    this.setState({redirect: '/signup/success'})
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(!prevState.redirect) { //means had redirected
      this.setState({redirect: false})
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props._set_StateInit()
  }

  render(){
    if(this.state.redirect) return (<Redirect to={this.state.redirect}/>);

    return(
      <div
        style={this.style.Signup_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={this.style.boxContent}>
            <Switch>
              <Route path={this.props.match.path+"/email"} render={(props)=> <SignupMailresend {...props}/>}/>
              <Route path={this.props.match.path+"/success"} render={(props)=> <SignupSuccess {...props}/>}/>
              <Route path={this.props.match.path+"/"} render={(props)=> <SignupForm {...props} _signup_success={this._signup_success}/>}/>
            </Switch>
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

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_StateInit: ()=>{dispatch(setSignInit());},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));
