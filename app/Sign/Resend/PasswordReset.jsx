import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import PasswordForm from '../../Components/PasswordForm/PasswordForm.jsx';
import {
  setSignInit
} from "../../redux/actions/sign.js";
import {
  setMessageSingle
} from "../../redux/actions/general.js";

class PasswordReset extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_success = this._submit_success.bind(this);
    this.style={
      SignupMailresend_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-end",
        width: "385px",
        maxWidth: "98vw",
        paddingTop: "12vh",
        marginBottom: "7.6vh"
      },
    }
  }

  _submit_success(){
    this.props._submit_SingleDialog({
      render: true,
      message: [{text:this.props.i18nUIString.catalog['message_Resend_PassReset'],style:{}}],
      handlerPositive: ()=>{window.location.assign('/')},
      buttonValue: 'Sing in'
    });

  }

  componentDidMount() {

  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        style={this.style.SignupMailresend_}>
        <div
          style={{marginBottom: '3rem'}}>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorBlack85)}>
            {this.props.i18nUIString.catalog["title_Sign_pwReset"]}
          </span>
        </div>
        <PasswordForm
          {...this.props}
          pwreset={true}
          _submit_success={this._submit_success}/>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_StateInit: ()=>{dispatch(setSignInit());},
    _submit_SingleDialog: (obj)=>{dispatch(setMessageSingle(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordReset));
