import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgAvetar from "../../../../Components/Svg/SvgAvetar.jsx";

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onMapNav: false
    };
    this._render_MapNav =this._render_MapNav.bind(this);
    this._handleClick_navBelongsMap = this._handleClick_navBelongsMap.bind(this);
    this._handleEnter_MapNav = this._handleEnter_MapNav.bind(this);
    this._handleLeave_MapNav = this._handleLeave_MapNav.bind(this);
  }

  _handleClick_navBelongsMap(event){
    event.stopPropagation();
    event.preventDefault();
    let targetCat = event.currentTarget.getAttribute('valuetab');
    //only switch if the user had set
    if(targetCat in this.props.belongsByType) this.props._set_viewTab(targetCat);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_MapNav(){
    switch (this.props.currentTab) {
      // Notice! pick the one "reverse" to the props.currentTab
      case "homeland":
        return(
          <div
            valuetab={"residence"}
            className={classnames(styles.boxMapNavLink)}
            onClick={this._handleClick_navBelongsMap}>
            <span
              className={classnames(
                styles.spanNav, 'colorWhiteGrey', 'fontContent',
                {
                  ["colorWhiteGrey"]: !this.state.onMapNav,
                  ["colorEditLightBlack"]: this.state.onMapNav,
                  [styles.spanNavMouse]: this.state.onMapNav,
                }
              )}
              onMouseEnter={this._handleEnter_MapNav}
              onMouseLeave={this._handleLeave_MapNav}>
              {this.props.i18nUIString.catalog['category_Belongs_'][1]}</span>
          </div>
        )
        break;
      case "residence":
        return (
          <div
            valuetab={"homeland"}
            className={classnames(styles.boxMapNavLink)}
            onClick={this._handleClick_navBelongsMap}>
            <span
              className={classnames(
                styles.spanNav, 'colorWhiteGrey', 'fontContent',
                {
                  ["colorWhiteGrey"]: !this.state.onMapNav,
                  ["colorEditLightBlack"]: this.state.onMapNav,
                  [styles.spanNavMouse]: this.state.onMapNav,
                }
              )}
              onMouseEnter={this._handleEnter_MapNav}
              onMouseLeave={this._handleLeave_MapNav}>
              {this.props.i18nUIString.catalog['category_Belongs_'][0]}</span>
          </div>
        )
        break;
      default:
        return null
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavBelongsMap)}>
        <div
          className={classnames(styles.svgNavAvetar)}>
          <SvgAvetar/>
        </div>
        <div
          style={{marginLeft: '2rem'}}>
          <span
            className={classnames('colorEditBlack', 'fontTitle')}>
            {this.props.i18nUIString.catalog['title_BelongsMap_Nav']}</span>
        </div>
        <div
          className={classnames(styles.boxStaticsDescript)}
          style={ (this.props.currentTab =="residence") ? {width: '8rem'}: {}}>
          <span
            className={classnames('colorEditBlack', 'fontContentPlain')}>
            { this.props.i18nUIString.catalog["link_BelongsMap_Nav"][(this.props.currentTab =="residence") ? 2 : 1] }
          </span>
        </div>
        {this._render_MapNav()}
      </div>
    )
  }

  _handleEnter_MapNav(e){
    this.setState({onMapNav: true})
  }

  _handleLeave_MapNav(e){
    this.setState({onMapNav: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav));
