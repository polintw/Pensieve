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
import {AccountPlate} from '../../../Component/AccountPlate.jsx';

const styleMiddle = {
  boxNav: {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '15vw',
    position: 'relative',
    boxSizing: 'border-box',
    textAlign: 'right'
  },
  fontNav: {
    fontSize: "1.36rem",
    letterSpacing: "0.08rem",
    whiteSpace: "nowrap",
    color: "#a8a8a8"
  },
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
        style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
        <Link
          to="/cosmic"
          method="focus"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          <span
            style={(this.state.mouseOn=='focus')? {color: '#333333'}:{}}>{"focus"}</span>
        </Link>
        <Link
          to="/user/screen"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_Account}
          onMouseLeave={this._handleLeave_Account}>
          <AccountPlate
            size={'layer'}
            accountFisrtName={this.props.userInfo.firstName}
            accountLastName={this.props.userInfo.lastName}
            styleFirst={{fontWeight: '600'}}/>
        </Link>
      </div>
    ): (
      <div>
        <Link
          to={{
            pathname: "/s/signin",
            search: ''
          }}
          className={'plainLinkButton'}>
          <span
            className={classnames(styles.spanLink)}>
            {'Sign in'}</span>
        </Link>
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
