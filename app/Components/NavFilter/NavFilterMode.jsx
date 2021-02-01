import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavFilterMode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSwitch: false
    };
    this._handleEnter_switchFilter = this._handleEnter_switchFilter.bind(this);
    this._handleLeave_switchFilter = this._handleLeave_switchFilter.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.viewFilterMap = urlParams.has('_filter_map');
    this.viewFilter = urlParams.has('_filter_nodes');

    return(
      <div
        className={classnames(styles.comNavFilterMode)}>
        <Link
          btn={"image"}
          to={this.props.location.pathname + '?_filter_nodes=true'}
          className={classnames(
            'plainLinkButton',
            {[styles.linkInactive]: !this.viewFilterMap}
          )}
          onTouchStart={this._handleEnter_switchFilter}
          onTouchEnd={this._handleLeave_switchFilter}
          onMouseEnter={this._handleEnter_switchFilter}
          onMouseLeave={this._handleLeave_switchFilter}>
          <span
            className={classnames(
              "fontContent",
              {
                ["colorAssistOcean"]: (this.viewFilterMap && this.state.onSwitch != 'image'),
                ["colorStandard"]: (!this.viewFilterMap || this.state.onSwitch == 'image'),
              }
            )}>
            {this.props.i18nUIString.catalog['btn_filteNav_Feed'][0]}
          </span>
        </Link>
        <span
          className={classnames(
            "fontContent", "colorEditBlack")}
          style={{cursor: 'text', margin: '0 1rem'}}>
          {"．"}
        </span>
        <Link
          btn={"map"}
          to={this.props.location.pathname + '?_filter_nodes=true&_filter_map=true'}
          className={classnames(
            'plainLinkButton',
            {[styles.linkInactive]: this.viewFilterMap}
          )}
          onTouchStart={this._handleEnter_switchFilter}
          onTouchEnd={this._handleLeave_switchFilter}
          onMouseEnter={this._handleEnter_switchFilter}
          onMouseLeave={this._handleLeave_switchFilter}>
          <span
            className={classnames(
              "fontContent",
              {
                ["colorAssistOcean"]: (!this.viewFilterMap && this.state.onSwitch != 'map'),
                ["colorStandard"]: (this.viewFilterMap || this.state.onSwitch == 'map'),
              }
            )}>
            {this.props.i18nUIString.catalog['btn_filteNav_Feed'][1]}
          </span>
        </Link>
      </div>
    )
  }

  _handleEnter_switchFilter(e){
    let currentBtn = e.currentTarget.getAttribute('btn');
    this.setState((prevState, props)=>{
      return {
        onSwitch: currentBtn
      }
    })
  }

  _handleLeave_switchFilter(e){
    this.setState((prevState, props)=>{
      return {
        onSwitch: false
      }
    })
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavFilterMode));
