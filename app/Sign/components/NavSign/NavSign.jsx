import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import {
  LinkMailResend,
} from '../SigninForm/SigninFormComps.jsx';

class NavSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onInActive: false
    };
    this._render_linkCenter= this._render_linkCenter.bind(this);
    this._handleEnter_Link = this._handleEnter_Link.bind(this);
    this._handleLeave_Link = this._handleLeave_Link.bind(this);
  }

  _handleEnter_Link(e){
    this.setState({onInActive: e.currentTarget.getAttribute('linkto')})
  }

  _handleLeave_Link(e){
    this.setState({onInActive: false})
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_linkCenter(){
    let navDOM = [];
    if(this.props.location.pathname.includes('/resend')){ // only under /s/, and "/s/" was set as 'base', not present in location.pathname
      navDOM.push(hrefSign(this, false, true, "/"));
    }
    else if(this.props.location.pathname.includes('/success')){
      navDOM.push(
        <Link
          key={"key_NavSign_toSignin"}
          to={{
            pathname: "/",
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton',
            styles.boxLinkSelfAlign
          )}
          onClick={(event)=>{ if(iscenter) event.preventDefault();}}>
          <span
            linkto= {"success"}
            className={classnames(
              styles.spanLinkSign,
              stylesFont.fontTitle,
              stylesFont.colorWhiteGrey,
              {[stylesFont.colorSignBlack]: this.state.onInActive=="success"}
            )}
            onMouseEnter={this._handleEnter_Link}
            onMouseLeave={this._handleLeave_Link}>
            {this.props.i18nUIString.catalog["submit_nav_Signin"]}
          </span>
        </Link>
      );
    }
    else if(this.props.location.pathname.includes('confirm/fail')){ // '/confirm/fail'
      navDOM.push(linkSignin(this, false));
      //and for this case, we add LinkMailResend additionally
      navDOM.unshift(
        <p
          key={"key_NavSign_verifiedMail"}
          style={{position: 'absolute', left:'0'}}>
          <LinkMailResend {...this.props}/>
        </p>
      );
    }
    else if(this.props.location.search.includes('invitation')){
      navDOM.push(linkSignup(this, false));
      navDOM.unshift( // base on linkSignin, modified style
        <Link
          key={"key_NavSign_toSignin"}
          to={{
            pathname: "/",
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton'
          )}>
          <span
            linkto={'signin'}
            className={classnames(
              styles.spanLinkSign,
              stylesFont.fontTitle,
              stylesFont.colorWhiteGrey,
              {[stylesFont.colorSignBlack]: this.state.onInActive =="signin"}
            )}
            onMouseEnter={this._handleEnter_Link}
            onMouseLeave={this._handleLeave_Link}>
            {this.props.i18nUIString.catalog["submit_nav_Signin"]}
          </span>
        </Link>
      );
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

const hrefSign = (self, iscenter, leftBorder, path) => {
  return (
    <a
      key={"key_NavSign_to_"+path}
      href={path}
      className={classnames(
        'plainLinkButton',
        {[styles.boxLinkSelfAlign]: !iscenter}
      )}
      style={ leftBorder ? {}: {border: 'unset'} }
      onClick={(event)=>{ if(iscenter) event.preventDefault();}}>
      <span
        linkto={"href"+path}
        className={classnames(
          styles.spanLinkSign,
          stylesFont.fontTitle,
          stylesFont.colorWhiteGrey,
          {[stylesFont.colorSignBlack]: self.state.onInActive== ("href"+path)}
        )}
        style={iscenter? {color: '#3c4144', cursor: 'default'}: {}}
        onMouseEnter={self._handleEnter_Link}
        onMouseLeave={self._handleLeave_Link}>
        {self.props.i18nUIString.catalog["submit_nav_Signin"]}
      </span>
    </a>
  )
};

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
        linkto={'signin'}
        className={classnames(
          styles.spanLinkSign,
          stylesFont.fontTitle,
          stylesFont.colorWhiteGrey,
          {[stylesFont.colorSignBlack]: (self.state.onInActive =="signin" && !iscenter)}
        )}
        style={iscenter? {color: '#3c4144', cursor: 'default'}: {}}
        onMouseEnter={self._handleEnter_Link}
        onMouseLeave={self._handleLeave_Link}>
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
        linkto={"signup"}
        className={classnames(
          styles.spanLinkSign,
          stylesFont.fontTitle,
          stylesFont.colorWhiteGrey,
          {[stylesFont.colorSignBlack]: (self.state.onInActive =="signup" && !iscenter)}
        )}
        style={iscenter? {color: '#3c4144', cursor: 'default'}: {}}
        onMouseEnter={self._handleEnter_Link}
        onMouseLeave={self._handleLeave_Link}>
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
