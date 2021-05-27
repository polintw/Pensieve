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
      opacity: this.props.sideOpacityParam,
      display: this.props.sideOpacityParam ? "unset" : "none"} // not display if '0'
    let centerPropsStyle = (this.props.sideOpacityParam < 1) ? {fontWeight: 'bold'} : {};

    return(
      <div
        className={classnames(styles.comNavFeed, styles.boxTitle)}>
        <div
          style={{display:'flex'}}>
          <Link
            to={ "/self/calendar" }
            topath={"calendar"}
            className={classnames('plainLinkButton')}
            onTouchStart={this._handleEnter_link}
            onTouchEnd={this._handleLeave_link}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}
            style={ Object.assign({}, { padding: '0 8px' }, sidePropsStyle)}>
            <span
              className={classnames(
                "fontSubtitle",
                {
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'calendar'),
                  ["colorLightGrey"]: (this.state.onNavLink != 'calendar'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'calendar'),
                  ["weightBold"]: (this.state.onNavLink == 'calendar')
                }
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][0] }
            </span>
          </Link>
          <Link
            to={"/cosmic/today"}
            topath={"today"}
            className={classnames('plainLinkButton')}
            onTouchStart={this._handleEnter_link}
            onTouchEnd={this._handleLeave_link}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}
            style={ Object.assign({}, { padding: '0 8px' }, centerPropsStyle)}>
            <span
              className={classnames(
                "fontSubtitle",
                {
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'today'),
                  ["colorLightGrey"]: (this.state.onNavLink != 'today'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'today'),
                  ["weightBold"]: (this.state.onNavLink == 'today')
                }
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][1] }
            </span>
          </Link>
          <Link
            to={"/cosmic/yesterday"}
            topath={"yesterday"}
            className={classnames('plainLinkButton')}
            onTouchStart={this._handleEnter_link}
            onTouchEnd={this._handleLeave_link}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}
            style={ Object.assign({}, { padding: '0 8px' }, sidePropsStyle)}>
            <span
              className={classnames(
                "fontSubtitle",
                {
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'yesterday'),
                  ["colorLightGrey"]: (this.state.onNavLink != 'yesterday'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'yesterday'),
                  ["weightBold"]: (this.state.onNavLink == 'yesterday')
                }
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][2] }
            </span>
          </Link>
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
