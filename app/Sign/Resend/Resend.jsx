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
import EmailResend from './EmailResend.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';
import ServiceLinks from '../../../Components/ServiceLinks.jsx';
import {
  setSignInit,
} from "../../../redux/actions/sign.js";

class Resend extends React.Component {
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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        style={this.style.Signup_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            className={styles.boxLogo}>
            <SvgLogo/>
          </div>
          <div
            style={this.style.boxContent}>
            <Switch>
              <Route path={this.props.match.path+"/pwreset"} render={(props)=> <PasswrodReset {...props}/>}/>
              <Route path={this.props.match.path+"/"} render={(props)=> <EmailResend {...props}/>}/>
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
)(Resend));
