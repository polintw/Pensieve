import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

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
            onClick={this._handleClick_navBelongsMap}>
            <span
              className={classnames(
                styles.spanNav, 'colorWhiteGrey',
                {[styles.spanNavMouse]: this.state.onMapNav}
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
            onClick={this._handleClick_navBelongsMap}>
            <span
              className={classnames(
                styles.spanNav, 'colorWhiteGrey',
                {[styles.spanNavMouse]: this.state.onMapNav}
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
