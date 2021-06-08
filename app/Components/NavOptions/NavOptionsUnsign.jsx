import React from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../Svg/SvgLogo.jsx';

class NavOptionsUnsign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onBtn: false
    };
    this._render_NavSmallScreen = this._render_NavSmallScreen.bind(this);
    this._handleEnter_Btn= this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_NavSmallScreen(){
    /*
    basically charge for screen width < 860
    depend on css class '.smallDisplayBox'
    */
    let currentPath = this.props.location.pathname;
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let signupinify = true;
    if(
      urlParams.has('process') ||
      currentPath.includes('/confirm') ||
      currentPath.includes('/signup')
    ) signupinify = false;

    return(
      <div
        className={classnames(styles.boxNavSmall)}>
        <div
          className={classnames(styles.selfCom_NavOptions_svg_)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/')}}>
            <SvgLogo
              reverseColor={false}/>
          </div>
        </div>
        <div
          className={classnames(
            styles.selfCom_NavOptions_svg_)}>
            {
              signupinify ? (
                <Link
                  to={'?process=signin'}
                  className={classnames(
                    'plainLinkButton', styles.boxSignupin,
                    {[styles.boxSignupinMouseon]: this.state.onBtn}
                  )}
                  onClick={()=>{ this._handleLeave_Btn(); }}
                  onTouchStart={this._handleEnter_Btn}
                  onTouchEnd={this._handleLeave_Btn}
                  onMouseEnter={this._handleEnter_Btn}
                  onMouseLeave={this._handleLeave_Btn}>
                  <span
                    className={classnames(
                      "fontSubtitle",
                      {
                        ["colorDescripBlack"]: this.state.onBtn,
                        ["colorEditLightBlack"]: !this.state.onBtn,
                      }
                    )}>
                    {this.props.i18nUIString.catalog['submit_nav_Signupin']}
                  </span>
                </Link>
              ) : (
                <span
                  className={classnames("fontSubtitle")}>
                  {'\xa0'}
                </span>
              )
            }
        </div>
      </div>
    );
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavOption)}>
        <div
          className={classnames(
            "smallDisplayBox", styles.boxNavOptionsSmall)}>
          {this._render_NavSmallScreen()}
        </div>
      </div>
    )
  }

  _handleEnter_Btn(e){
    this.setState({onBtn: true})
  }

  _handleLeave_Btn(e){
    this.setState({
      onBtn: false})
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
)(NavOptionsUnsign));
