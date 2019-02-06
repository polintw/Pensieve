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
  SignupMailresend,
  SignupSuccess
} from './SignupCom.jsx';
import {
  axiosSwitch,
  axiosGetRes
} from "../../redux/actions/handleSign.js";

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
          <Route path={this.props.match.path+"/email"} render={(props)=> <SignupMailresend {...props}/>}/>
          <Route path={this.props.match.path+"/success"} render={(props)=> <SignupSuccess {...props}/>}/>
          <Route path={this.props.match.path+"/"} render={(props)=> <SignupForm {...props}/>}/>
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
    _set_axiosStatus: (bool)=>{dispatch(axiosSwitch(bool));},
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));
