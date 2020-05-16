import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalBox from '../ModalBox.jsx';
import AccountPalette from '../AccountPalette.jsx';

class NavOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false,
      toolBoxify: false
    };
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_ToolBox_logout = this._handleClick_ToolBox_logout.bind(this);
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
  }

  _handleClick_ToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRefresh');
    window.location.assign('/');
  }

  render(){
    return(
      <div>
        <div
          id={"NavOptions_Self"}
          className={styles.selfCom_NavOptions_svg_}
          onClick={this._handleClick_navToolBox}>
          <AccountPalette
            size={'regular'}
            accountFirstName={this.props.userInfo.firstName}
            accountLastName={this.props.userInfo.lastName}
            styleFirst={{ display: 'block', fontWeight: '600' }}
            styleLast={{ display: 'block'}} />

        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="NavOptions_Self">
            <div
              className={classnames(
                styles.selfCom_NavOptions_ToolBox_,
                styles.fontContent,
                styles.colorOptionsBlack
              )}>
              <div style={{marginBottom: '2rem'}}>
                <span style={{fontSize: '1.6rem'}}>
                  {this.props.i18nUIString.catalog["message_hello"]}
                </span>
                <AccountPalette
                  size={'regular'}
                  accountFirstName={this.props.userInfo.firstName}
                  accountLastName={this.props.userInfo.lastName}
                  styleFirst={{ color: '#f3b55a'}} />
              </div>

              <ol
                className={styles.boxOlist}>
                <li
                  method="account"
                  className={classnames(styles.boxLiItem)}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/self/profile/sheet') }}
                  onMouseEnter={this._handleEnter_CornerOpt}
                  onMouseLeave={this._handleLeave_CornerOpt}>
                  <span
                    style={(this.state.mouseOn == 'account') ? {borderBottom: "solid 1px #333333"}:{}}>
                    {this.props.i18nUIString.catalog["submit_Options_profile"]}
                  </span>
                </li>
              </ol>

              <div
                className={styles.boxLogout}>
                <span
                  method="logout"
                  style={{cursor: 'pointer', borderBottom: (this.state.mouseOn == 'logout') ? "solid 1px #333333": ""}}
                  onClick={this._handleClick_ToolBox_logout}
                  onMouseEnter={this._handleEnter_CornerOpt}
                  onMouseLeave={this._handleLeave_CornerOpt}>
                  {this.props.i18nUIString.catalog["submit_logout"]}
                </span>
              </div>
            </div>
          </ModalBox>
        }
      </div>
    )
  }


  _handleEnter_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
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
)(NavOptions));
