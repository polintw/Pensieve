import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../../Components/AccountPalette.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this.refScroll = React.createRef();
    this._render_serviceNav = this._render_serviceNav.bind(this);
    this._handleEnter_Link = this._handleEnter_Link.bind(this);
    this._handleLeave_Link = this._handleLeave_Link.bind(this);
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_serviceNav(){
    const navItems = ["about", 'terms', "privacy", "contact"];
    const currentPath = window.location.pathname;

    let navDOM = navItems.map((text, index)=> {
      // make the 1st char in text to cap
      let upperChar = text.charAt(0).toUpperCase();
      let restChar = text.slice(1);
      let displayText = upperChar + restChar;
      // check if on path
      let pathify = currentPath.includes(text);

      return (
        <Link
          key={"key_serviceNav_"+index}
          to= {"/" + text}
          topath={text}
          className={classnames(
            'plainLinkButton', styles.boxLink, styles.boxNavLink,
            {[styles.boxNavLinkMouse]: (this.state.mouseOn == text )}
          )}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          <span
            className={classnames(
              {
                ["weightBold"]: (pathify),
                ["colorStandard"]: (pathify),
                ["colorEditBlack"]: (this.state.mouseOn == text && !pathify),
              }
            )}>
            {displayText}
          </span>
        </Link>
      )
    })

    return navDOM;
  }

  render(){
    return (
      <div
        className={classnames(styles.comAboutNav, styles.fontNav)}>
        <div>
          { // if under a valid token
            (this.props.tokenStatus == 'verified') ? (
              <a
                href="/"
                topath={"index"}
                className={classnames(
                  'plainLinkButton', 'colorDescripBlack', styles.boxLink,
                  {
                    [styles.linkMouse]: (this.state.mouseOn == 'index'),
                    [styles.linkNoMouse]: (this.state.mouseOn != 'index')
                  }
                )}
                onMouseEnter={this._handleEnter_Link}
                onMouseLeave={this._handleLeave_Link}>
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
                topath={"index"}
                className={classnames(
                  'plainLinkButton', 'colorDescripBlack', 'fontSubtitle', styles.boxLink,
                  {
                    [styles.linkMouse]: (this.state.mouseOn == 'index'),
                    [styles.linkNoMouse]: (this.state.mouseOn != 'index')
                  }
                )}
                onMouseEnter={this._handleEnter_Link}
                onMouseLeave={this._handleLeave_Link}>
                {this.props.i18nUIString.catalog['submit_nav_Signupin']}
              </a>
            )
          }
        </div>
        <div>
          {this._render_serviceNav()}
        </div>
      </div>
    )
  }

  _handleEnter_Link(e) {
    this.setState({
      mouseOn: e.currentTarget.attributes.topath.value
    })
  }

  _handleLeave_Link(e) {
    this.setState({
      mouseOn: ''
    })
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
