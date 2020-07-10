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
import SignupForm from '../components/SignupCom/SignupForm.jsx';
import SignupSuccess from '../components/SignupCom/SignupSuccess.jsx';
import NavSign from '../components/NavSign/NavSign.jsx';
import {
  setSignInit,
} from "../../redux/actions/sign.js";

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false
    };
    this._signup_success = this._signup_success.bind(this);
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
        className={classnames(styles.boxColumn)}>
        <Switch>
          <Route path={this.props.match.path+"/success"} render={(props)=> <SignupSuccess {...props}/>}/>
          <Route path={this.props.match.path+"/"} render={(props)=> <SignupForm {...props} _signup_success={this._signup_success}/>}/>
        </Switch>

        <div
          className={classnames(styles.boxNav)}>
          <NavSign
            {...this.props}/>
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
