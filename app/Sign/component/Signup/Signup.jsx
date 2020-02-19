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
import {
  axiosGetRes
} from "../../../redux/actions/sign.js";
import ServiceLinks from '../../../Components/ServiceLinks.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

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

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.Signup_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={commonStyle.signLogo}>
            <SvgLogo/>
          </div>
          <div
            style={this.style.boxContent}>
            <Switch>
              <Route path={this.props.match.path+"/email"} render={(props)=> <SignupMailresend {...props}/>}/>
              <Route path={this.props.match.path+"/success"} render={(props)=> <SignupSuccess {...props}/>}/>
              <Route path={this.props.match.path+"/"} render={(props)=> <SignupForm {...props}/>}/>
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
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));
