import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../Svg/SvgLogo.jsx';

class NavOptionsUnsign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_NavSmallScreen = this._render_NavSmallScreen.bind(this);
  }

  _render_NavSmallScreen(){
    /*
    basically charge for screen width < 860
    depend on css class '.smallDisplayBox'
    */
    let currentPath = this.props.location.pathname;

    /* Ok, we are now didn't want the "Sign up/in" show on the topbar-but keep them here in case our mind changed
    if(this.props.location.pathname.includes('cosmic/explore/')){
      return(
        <div
          className={classnames(styles.boxNavSmall)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
            <SvgLogo
              reverseColor={true}/>
          </div>
          <div
            id={"NavOptions_Self_small"}
            className={classnames(
              styles.selfCom_NavOptions_svg_, 'colorWhite', 'fontSubtitle',
              "smallDisplayBox"
            )}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/');}}>
            {this.props.i18nUIString.catalog['submit_nav_Signupin']}
          </div>
        </div>
      );
    }
    else{*/
      return(
        <div
          className={classnames(styles.boxNavSmall)}
          style={{justifyContent: 'flex-end'}}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
            <SvgLogo
              reverseColor={true}/>
          </div>
        </div>
      );
    // };
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavOption)}>
        <div
          className={classnames("smallDisplayBox")}
          style={{width: '100%', padding: "0 1.38vw", boxSizing: 'border-box'}}>
          {
            /*Notice, this render method actually deal with only situation the screen width < 860px
            and the rest (>860px) would rely on the next DOM beneath*/
            this._render_NavSmallScreen()
          }
        </div>
      </div>
    )
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
