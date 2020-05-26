import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

const styleMiddle = {
  spanNav: {
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
}

class NavSite extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refScroll = React.createRef();
    this._handleEnter_Account = this._handleEnter_Account.bind(this);
    this._handleLeave_Account = this._handleLeave_Account.bind(this);
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this.style={

    }
  }

  _handleEnter_CornerOpt(e){
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e){
    this.setState({
      mouseOn: ''
    })
  }

  _handleEnter_Account(e){
    this.setState({
      onAccount: true
    })
  }

  _handleLeave_Account(e){
    this.setState({
      onAccount: false
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return this.props.token=="verified" ? (
      <div
        className={classnames(styles.comNavSite)}>
        <a
          href="/"
          method="back"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          <span
            className={classnames(styles.spanLink, styles.fontLink)}
            style={{borderBottom: (this.state.mouseOn=='back')? '1px solid #ff7a5f': '1px solid #ababab'}}>{"back"}</span>
        </a>
      </div>
    ): (
      <div
        className={classnames(styles.comNavSite)}>
        <a
          href={"/"}
          method="sign"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          <span
            className={classnames(styles.spanLink, styles.fontLink)}
            style={{borderBottom: (this.state.mouseOn=='sign')? '1px solid #ff7a5f': '1px solid #ababab'}}>{'Sign in'}</span>
        </a>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    token: state.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavSite));
