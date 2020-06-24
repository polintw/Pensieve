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
      onMapNav: false,
      currentMouseOn: false
    };
    this._render_MapNav =this._render_MapNav.bind(this);
    this._render_NavBelongSeries = this._render_NavBelongSeries.bind(this);
    this._handleClick_navBelongSeries = this._handleClick_navBelongSeries.bind(this);
    this._handleClick_navBelongsMap = this._handleClick_navBelongsMap.bind(this);
    this._handleEnter_MapNav = this._handleEnter_MapNav.bind(this);
    this._handleLeave_MapNav = this._handleLeave_MapNav.bind(this);
    this._handleEnter_navLinkSeries = this._handleEnter_navLinkSeries.bind(this);
    this._handleLeave_navLinkSeries = this._handleLeave_navLinkSeries.bind(this);
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

  _render_NavBelongSeries(){
    let targetSeries = (this.props.currentTab== "homeland") ? "homelandup" : "residenceup" ;
    // first, check if the belong was set
    if( !(targetSeries in this.props.belongsByType)) return [];

    let typeList = this.props.belongsByType[targetSeries].listToTop.slice(); //shallow copy
    // then unshift the belong itself
    typeList.unshift(this.props.belongsByType[targetSeries].nodeId);
    let navDOM = typeList.map((nodeId, index)=>{
      return (
        <div
          key={'key_NavBelongSeries_' + nodeId}
          nodeid={nodeId}
          className={classnames(
            styles.boxNavLinkSeries,
          )}
          style={(index > 0) ? {borderLeft: 'solid 1px #d8d8d8'}: {}}
          onClick={this._handleClick_navBelongSeries}
          onMouseEnter={this._handleEnter_navLinkSeries}
          onMouseLeave={this._handleLeave_navLinkSeries}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span
                className={classnames(
                  styles.spanNavLinkSeries,
                  "fontSubtitle", "weightBold", "colorLightGrey",
                  {["colorEditBlack"]: (this.props.currentNode== nodeId),
                    [styles.spanNavLinkSeriesMouse]: (this.state.onLinkSeries == nodeId && this.props.currentNode != nodeId)}
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
            </div>
          }
        </div>
      )
    });
    return navDOM;
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
          className={classnames(styles.boxNavTitle)}>
          <div
            className={classnames(styles.svgNavAvetar)}>
            <SvgAvetar/>
          </div>
          <div
            className={classnames(styles.boxNavTitleType)}>
            <span
              className={classnames('colorEditLightBlack', 'fontContent')}>
              {this.props.i18nUIString.catalog['title_BelongsMap_Nav'][0]}
              { this.props.i18nUIString.catalog["title_BelongsMap_Nav"][(this.props.currentTab =="residence") ? 2 : 1] }
            </span>
            <span
              className={classnames(styles.spanStaticDescript, 'colorEditLightBlack', 'fontContent')}>
              { this.props.i18nUIString.catalog["link_BelongsMap_Nav"][(this.props.currentTab =="residence") ? 2 : 1] }
            </span>
          </div>
          {this._render_MapNav()}
        </div>

        <div
          className={classnames(styles.boxNavSeries)}>
          <div
            className={classnames(styles.boxNavTitleLower)}>
            {this._render_NavBelongSeries()}
          </div>
        </div>
      </div>
    )
  }

  _handleClick_navBelongSeries(event){
    event.stopPropagation();
    event.preventDefault();
    let targetNode= event.currentTarget.getAttribute('nodeid');
    if(targetNode == this.props.currentNode) return; // no effect if clicked on the currentNode
    this.props._set_viewNode(targetNode);
  }

  _handleEnter_MapNav(e){
    this.setState({onMapNav: true})
  }

  _handleLeave_MapNav(e){
    this.setState({onMapNav: false})
  }

  _handleEnter_navLinkSeries(e){
    let currentMouseOn = e.currentTarget.getAttribute('nodeid');
    this.setState({onLinkSeries: currentMouseOn});
  }

  _handleLeave_navLinkSeries(e){
    this.setState({onLinkSeries: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
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
