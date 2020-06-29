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
import NavSign from '../components/NavSign/NavSign.jsx';
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
        marginBottom: "7.6vh"
      },
    }
  }

  componentDidMount() {
    // checking the token existence

    //if(window.localStorage['token'])
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
              className={classnames(styles.boxNav)}>
              <NavSign
                {...this.props}/>
            </div>
          </div>
        )
        break;
      case "confirm":
        return
        break;
      case "unsigned":
        return (
          <div>
            {"you have to sign in first"}
            <SigninForm
              {...props}
              _signin_success={window.location.reload()} />
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
            {this.props.i18nUIString.catalog["title_Sign_pwReset"]}
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
