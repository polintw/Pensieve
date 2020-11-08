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
      <div
        className={classnames(styles.comNavShareds, styles.boxTitle)}>
        <div
          style={{display:'flex'}}>
          <Link
            to={ linkPath }
            className={classnames('plainLinkButton')}
            style={{cursor: 'default'}}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}>
            <span
              className={classnames(
                "fontContentPlain", "weightBold", "colorLightGrey",
                {[styles.spanLinkMouse]: (this.state.onNavLink)}
              )}>
              {
                pathProjectify ? this.props.i18nUIString.catalog['link_Nav_Shareds_'][0] + this.props.i18nUIString.catalog['link_Nav_Shareds_'][1] :
                (this.props.i18nUIString.catalog["link_Nav_Shareds_"][0] +this.props.userInfo.pathProject)
              }
            </span>
          </Link>
        </div>
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
