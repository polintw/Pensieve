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

    if(this.props.location.pathname.includes('explore/unit')){
      return(
        <div
          id={"NavOptions_Self_small"}
          className={classnames(
            styles.selfCom_NavOptions_svg_, 'colorWhite', 'fontSubtitle',
            styles.smallDisplayBox
          )}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/');}}>
          {this.props.i18nUIString.catalog['submit_nav_Signin']}
        </div>
      );
    }
    else return null;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavOption)}>
        <div
          className={classnames(styles.boxLogo, styles.smallDisplayBox)}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
          <SvgLogo
            reverseColor={true}/>
        </div>

        { this._render_NavSmallScreen()
          /*Notice, this render method actually deal with only situation the screen width < 860px
          and the rest (>860px) would rely on the next DOM beneath*/
        }
        { // only show up on /unit view
          (this.props.location.pathname.includes('explore/unit')) &&
          <div
            id={"NavOptions_Self_"}
            className={classnames(
              styles.selfCom_NavOptions_svg_, 'fontSubtitle', 'colorDescripBlack',
              styles.smallDisplayNone)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
            {this.props.i18nUIString.catalog['submit_nav_Signin']}
          </div>
        }
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
