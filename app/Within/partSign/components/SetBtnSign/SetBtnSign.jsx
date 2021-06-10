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

class SetBtnSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onCreate: false,
      onLink: false
    };
    this._handleEnter_onLink = this._handleEnter_onLink.bind(this);
    this._handleLeave_onLink = this._handleLeave_onLink.bind(this);
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comSetBtnSign)}>
        <div
          className={classnames(styles.boxIndexShare)}>
          <Link
            to={'/signup'}
            className={classnames(
              'plainLinkButton', styles.comBtnUpload, styles.btnBorder,
              {[styles.comMouseEnter]: (this.state.onCreate) }
            )}
            onTouchStart={this._handleEnter_Upload}
            onTouchEnd={this._handleLeave_Upload}
            onMouseEnter={this._handleEnter_Upload}
            onMouseLeave={this._handleLeave_Upload}>
            <span
              className={classnames(
                styles.spanWriter, 'lineHeight15', "fontNodesEqual", "weightBold",
                {
                  ['colorStandard']: (this.state.onCreate),
                  ['colorDarkGrey']: (!this.state.onCreate),
                }
              )}>
              {this.props.i18nUIString.catalog['submit_nav_Signup'] }
            </span>
          </Link>
        </div>
        <div
          className={classnames(styles.boxSigninhint)}>
          <span
            className={classnames(
              "fontContentPlain", "colorEditBlack")}>
            {this.props.i18nUIString.catalog['guiding_IndexUnsign_SigninDescript'][0]}
          </span>
          <Link
            to={'/?process=signin'}
            className={classnames(
              'plainLinkButton')}
            onTouchStart={this._handleEnter_onLink}
            onTouchEnd={this._handleLeave_onLink}
            onMouseEnter={this._handleEnter_onLink}
            onMouseLeave={this._handleLeave_onLink}>
            <span
              className={classnames(
                "fontContentPlain", styles.spanLink,
                {
                  ["colorEditBlack"]: this.state.onLink,
                  ["colorStandard"]: !this.state.onLink,
                  [styles.spanLinkMouse]: this.state.onLink,
                }
              )}>
                {this.props.i18nUIString.catalog['submit_nav_Signin']}
              </span>
          </Link>
          <span
            className={classnames(
              "fontContentPlain", "colorEditBlack")}>
              { '\xa0' + this.props.i18nUIString.catalog['guiding_IndexUnsign_SigninDescript'][1]}
            </span>
        </div>
      </div>
    )
  }

  _handleEnter_Upload(e){
    this.setState({onCreate: true})
  }

  _handleLeave_Upload(e){
    this.setState({
      onCreate: false})
  }

  _handleEnter_onLink(e){
    this.setState({onLink: true})
  }

  _handleLeave_onLink(e){
    this.setState({
      onLink: false})
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SetBtnSign));
