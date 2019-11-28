import React from 'react';
import {
  Route,
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavActions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false
    };
    this._handleEnter_Option = this._handleEnter_Option.bind(this);
    this._handleLeave_Option = this._handleLeave_Option.bind(this);
    this.style={

    }
  }

  _handleEnter_Option(e){
    this.setState({
      mouseOn: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_Option(e){
    this.setState({
      mouseOn: ''
    })
  }

  render(){
    return(
    <nav
      className={classnames(styles.boxNav)}>
      <Link
        to={this.props.match.url+"/shareds"}
        value={'shared'}
        className={classnames(
          'plainLinkButton',
          styles.boxLink,
          {[styles.boxLinkActive]: (this.state.mouseOn=='shared')}
        )}
        onMouseEnter={this._handleEnter_Option}
        onMouseLeave={this._handleLeave_Option}>
        <span
          className={classnames(styles.spanText, styles.fontLink)}>
          {"shared"}</span>
      </Link>
      <span
        className={classnames(styles.spanText, styles.fontLink)}>
        {"launched"}</span>
      <span
        className={classnames(styles.spanText, styles.fontLink)}>
        {"workspace"}</span>
    </nav>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavActions));
