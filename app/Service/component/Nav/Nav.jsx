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
import AccountPalette from '../../../Components/AccountPalette.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

const styleMiddle = {
  spanNav: {
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
}

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this.refScroll = React.createRef();
    this._handleEnter_Link = this._handleEnter_Link.bind(this);
    this._handleLeave_Link = this._handleLeave_Link.bind(this);
    this.style={

    }
  }

  _handleEnter_Link(e){
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_Link(e){
    this.setState({
      mouseOn: ''
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div
        className={classnames(styles.comAboutNav, styles.fontNav)}>
        <div
          className={classnames(styles.comNavOption)}>
          { // if under a valid token
            (this.props.tokenStatus == 'verified') ? (
              <a
                href="/"
                className={classnames('plainLinkButton', 'colorDescripBlack')}>
                <div
                  className={classnames(styles.smallDisplayBox)}
                  style={{height:"20px"}}>
                  <SvgLogo
                    reverseColor={false}/>
                </div>
                <div
                  className={classnames(styles.smallDisplayNone)}>
                  <AccountPalette
                    size={'regular'}
                    accountFirstName={this.props.userInfo.firstName}
                    accountLastName={this.props.userInfo.lastName}
                    styleFirst={{ fontWeight: '600' }}/>
                </div>
              </a>
            ):(
              <a
                href="/"
                className={classnames(
                  'plainLinkButton', 'fontSubtitle', 'colorDescripBlack')}>
                {this.props.i18nUIString.catalog['submit_nav_Signin']}
              </a>
            )
          }
        </div>
        <div>
          <Link
            to="/terms"
            method="terms"
            className={classnames('plainLinkButton', styles.boxLink)}
            onMouseEnter={this._handleEnter_Link}
            onMouseLeave={this._handleLeave_Link}>
            {
              (this.state.mouseOn=='terms') &&
              <span style={{
                  width: '80%', position: 'absolute', bottom: '-11%', left: '10%',
                  borderBottom: 'solid 1px rgb(64, 133, 160)'
                }}/>
              }
              <span>{"Terms"}</span>
            </Link>
            <Link
              to="/privacy"
              method="privacy"
              className={classnames('plainLinkButton', styles.boxLink)}
              onMouseEnter={this._handleEnter_Link}
              onMouseLeave={this._handleLeave_Link}>
              {
                (this.state.mouseOn=='privacy') &&
                <span style={{
                    width: '80%', position: 'absolute', bottom: '-11%', left: '10%',
                    borderBottom: 'solid 1px rgb(64, 133, 160)'
                  }}/>
                }
                <span>{"Privacy"}</span>
              </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString
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
