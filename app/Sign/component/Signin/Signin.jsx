import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SigninForm from './SigninForm/SigninForm.jsx';
import ServiceLinks from '../../../Components/ServiceLinks.jsx';
import {
  setSignInit,
} from "../../../redux/actions/sign.js";


class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._signin_success = this._signin_success.bind(this);
    this.style={
      Signin_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Signin_member_: {
        width: '20vw',
        height: '70%',
        position: 'absolute',
        top: '15%',
        right: '0',
        boxSizing:'border-box'
      },
    }
  }

  _signin_success(){
    window.location.assign('/');
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        style={this.style.Signin_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={this.style.Signin_member_}>
            <SigninForm
              _signin_success={this._signin_success}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxServiceLink)}>
          <ServiceLinks/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    i18nUIString: state.i18nUIString,
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
)(Signin));
