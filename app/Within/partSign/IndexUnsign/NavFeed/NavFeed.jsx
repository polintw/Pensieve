import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNavLink: false
    };
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let sidePropsStyle = {
      opacity: this.props.sideOpacityParam}
    let centerPropsStyle = (this.props.sideOpacityParam < 0.5) ? {fontWeight: 'bold', color: '#f3b55a'} : {};

    return(
      <div
        className={classnames(styles.comNavFeed, styles.boxTitle)}>
        <div
          className={classnames(styles.boxLinks)}>

          <div
            className={classnames(styles.boxDecoLine)}
            style={ Object.assign({}, sidePropsStyle)}>
            <svg viewBox="0 0 20 20"
              style={Object.assign({}, {
                height: '100%',
                maxWidth: '100%',
                position: 'relative',
                boxSizing: 'border-box'
              })}>
              <circle fill="#b8b8b8" cx="10" cy="10" r="5"></circle>
            </svg>
            <a id={"topFeed"} style={{opacity: '0'}}/>
          </div>
          <a
            href={"#topFeed"}
            topath={"int_feedAssigned"}
            className={classnames(
              'plainLinkButton',
              { // to control together by style
                ["colorLightGrey"]: (this.state.onNavLink != 'int_feedAssigned'),
                ["colorEditBlack"]: (this.state.onNavLink == 'int_feedAssigned'),
                ["weightBold"]: (this.state.onNavLink == 'int_feedAssigned')
              }
            )}
            onTouchStart={this._handleEnter_link}
            onTouchEnd={this._handleLeave_link}
            onMouseUp={this._handleLeave_link}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}
            style={ Object.assign({}, { padding: '0 8px' }, centerPropsStyle)}>
            <span
              className={classnames(
                "fontSubtitle",
                {[styles.spanLinkMouse]: (this.state.onNavLink == 'int_feedAssigned')}
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][1] }
            </span>
          </a>
        </div>
      </div>
    )
  }

  _handleEnter_link(e){
    let linkTo = e.currentTarget.getAttribute('topath');
    this.setState({onNavLink: linkTo});
  }

  _handleLeave_link(e){
    this.setState({onNavLink: false})
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
)(NavFeed));
