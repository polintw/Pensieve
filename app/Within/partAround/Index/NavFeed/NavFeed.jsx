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
            to={ "/self/shareds" }
            topath={"personal"}
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
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'personal'),
                  ["colorLightGrey"]: (this.state.onNavLink != 'personal'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'personal'),
                  ["weightBold"]: (this.state.onNavLink == 'personal')
                }
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][0] }
            </span>
          </Link>
          <Link
            to={"/#topFeed"}
            topath={"int_feedAssigned"}
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
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'int_feedAssigned'),
                  ["colorLightGrey"]: (this.state.onNavLink != 'int_feedAssigned'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'int_feedAssigned'),
                  ["weightBold"]: (this.state.onNavLink == 'int_feedAssigned')
                }
              )}>
              {this.props.i18nUIString.catalog["title_Index_NavFeed_"][1] }
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
