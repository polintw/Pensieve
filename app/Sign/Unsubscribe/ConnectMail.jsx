import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import SigninForm from '../components/SigninForm/SigninForm.jsx';
import NavHome from '../components/NavHome/NavHome.jsx';
import MessageInput from '../components/MessageInput/MessageInput.jsx';
import {
  setSignInit
} from "../../redux/actions/sign.js";

class ConnectMail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      view: 'init'
    };
    this._render_unsubscribeMail = this._render_unsubscribeMail.bind(this);
    this.style={
      SignupMailresend_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-end",
        width: "385px",
        maxWidth: "98vw",
        paddingTop: "12vh",
      },
      ConfirmSuccess_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {
    // checking the token existence
    if(!window.localStorage['token']){
      this.setState({view: 'unsigned'});
    }
    else{ // has token
      this.setState({view: 'confirm'});
    }
  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  _render_unsubscribeMail(){
    switch (this.state.view) {
      case "complete":
        return (
          <div>
            <div
              className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}
              style={{ marginBottom: "7.6vh"}}>
              <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail_complete"][0]}</p>
              <br/>
              <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail_complete"][1]}</p>
            </div>
            <div
              className={classnames(styles.boxNav)}>
              <NavHome/> //Home
            </div>
          </div>
        )
        break;
      case "confirm":
        return (
          <div
            style={this.style.ConfirmSuccess_}>
            <div
              className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}>
              <p>{this.props.i18nUIString.catalog["descript_Sign_UnsubMail"]}</p>
            </div>

          </div>
        )
        break;
      case "unsigned":
        return (
          <div>
            <div
              className={classnames(styles.boxWarning)}>
              <MessageInput
                messageIcon={false}
                messageText={this.props.i18nUIString.catalog["message_Sign_UnsubMail_noToken"]}/>
            </div>
            <SigninForm
              {...this.props}
              _signin_success={()=>{window.location.reload();} } />
          </div>
        )
        break;
      default:
        return null // basically the init state
    }
  }

  render(){
    return(
      <div
        style={this.style.SignupMailresend_}>
        <div
          style={{marginBottom: '3rem'}}>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorBlack85)}>
            {this.props.i18nUIString.catalog["title_Sign_UnsubMail"]}
          </span>
        </div>
        {this._render_unsubscribeMail()}
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
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectMail));
