import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class ConfirmSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.ConfirmSuccess_}>
        <div>
          <p>{"Email address has successfully verified."}</p>
          <p>{"Log in and start your adventure to the World"}</p>
          <Link
            to="/signin">
            <span>{"Sign in"}</span>
          </Link>
        </div>
      </div>
    )
  }
}

class ConfirmFail extends React.Component {
  constructor(props){
    super(props);
    this.state = {

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

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.ConfirmFail_}>
        <div>
          <div>
            <p>{"Email address verified failed."}</p>
            <p>{"It's probablly due to the duration was over."}</p>
            <Link to="/signup">
              <span>{"Sign up"}</span>
            </Link>
          </div>
          <div>
            <p>{"Haven't received the mail?"}</p>
            <div>{"Send the verification again!"}</div>
            <Link to="/signup/email">
              <span>{"send the verified email again"}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

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
      }
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
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Confirmation_}>
        <Route path={this.props.match.path+"/success"} render={(props)=> <ConfirmSuccess {...props}/>}/>
        <Route path={this.props.match.path+"/fail"} render={(props)=> <ConfirmFail {...props}/>}/>
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation));
