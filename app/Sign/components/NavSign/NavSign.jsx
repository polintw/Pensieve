import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';

class NavSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_linkCenter= this._render_linkCenter.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_linkCenter(){
    let navDOM = [];
    if(this.props.location.pathname.includes('/success')){

    }
    else if(this.props.location.pathname.includes('/signup')){
      navDOM.push(linkSignup(this, true));
      navDOM.push(linkSignin(this, false));
    }
    else{
       navDOM.push(linkSignin(this, true));
       navDOM.push(linkSignup(this, false));
    };
    return navDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavSign)}>
        {this._render_linkCenter()}
      </div>
    )
  }
}

const linkSignin = (self, iscenter) => {
  return (
    <Link
      key={"key_NavSign_toSignin"}
      to={{
        pathname: "/",
        state: {from: self.props.location}
      }}
      className={classnames(
        'plainLinkButton',
        {[styles.boxLinkSelfAlign]: !iscenter}
      )}
      onClick={(event)=>{ if(iscenter) event.preventDefault();}}>
      <span
        className={classnames(
          styles.spanLinkSign,
          stylesFont.fontTitle,
          stylesFont.colorWhiteGrey
        )}
        style={iscenter? {color: '#3c4144', cursor: 'default'}: {}}>
        {self.props.i18nUIString.catalog["submit_nav_Signin"]}
      </span>
    </Link>
  )
};

const linkSignup = (self, iscenter) => {
  return (
    <Link
      key={"key_NavSign_toSignup"}
      to={{
        pathname: "/signup",
        state: {from: self.props.location}
      }}
      className={classnames(
        'plainLinkButton',
        {[styles.boxLinkSelfAlign]: !iscenter}
      )}
      onClick={(event)=>{ if(iscenter) event.preventDefault();}}>
      <span
        className={classnames(
          styles.spanLinkSign,
          stylesFont.fontTitle,
          stylesFont.colorWhiteGrey
        )}
        style={iscenter? {color: '#3c4144', cursor: 'default'}: {}}>
        {self.props.i18nUIString.catalog["submit_nav_Signup"]}
      </span>
    </Link>
  )
};

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavSign));
