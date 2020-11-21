import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavShareds extends React.Component {
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
    let pathProjectify = this.props.location.pathname.includes('/pathProject');
    let linkPath = "/self/shareds" + (pathProjectify ? "" : "/pathProject") ;

    return(
      <div>
        <Link
          to={ linkPath }
          className={classnames(
            'plainLinkButton', styles.boxNavLink,
            {[styles.boxNavLinkMouse]: (this.state.onNavLink)}
          )}
          onMouseEnter={this._handleEnter_link}
          onMouseLeave={this._handleLeave_link}>
          <span
            className={classnames(
              "fontContentPlain", "weightBold",
              {
                ["colorWhiteGrey"]: (!this.state.onNavLink),
                ["colorAssistOcean"]: (this.state.onNavLink),
              }
            )}>
            {this.props.i18nUIString.catalog['link_Nav_Shareds_'][0]}
          </span>
          <span
            className={classnames(
              "fontContentPlain", "weightBold",
              {
                ["colorWhiteGrey"]: (!this.state.onNavLink),
                ["colorEditBlack"]: (this.state.onNavLink),
              })}>
            { pathProjectify ? this.props.i18nUIString.catalog['link_Nav_Shareds_'][1] : this.props.userInfo.pathProject }
          </span>
        </Link>
      </div>
    )
  }

  _handleEnter_link(e){
    this.setState({onNavLink: true});
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
)(NavShareds));
