import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {AccountPlate} from '../../../Component/AccountPlate.jsx';

let pathCognition = true;

class NavSelf extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFocus: false,
      onAccount: false
    };
    this._handleEnter_Focus = this._handleEnter_Focus.bind(this);
    this._handleLeave_Focus = this._handleLeave_Focus.bind(this);
    this._handleEnter_Account = this._handleEnter_Account.bind(this);
    this._handleLeave_Account = this._handleLeave_Account.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this.style={

    };
  }

  static getDerivedStateFromProps(props, state){
    pathCognition = (props.location.pathname.substring(0,10)=='/cognition') ? true : false;
    return null; //expect a state update, so return null to update nothing.
  }

  _handleEnter_Focus(e){
    this.setState({
      onFocus: true
    })
  }

  _handleLeave_Focus(e){
    this.setState({
      onFocus: false
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

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    if(pathCognition) window.location.assign('/user/screen');
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavSelf)}
        style={{justifyContent: pathCognition? 'space-between': 'flex-end'}}>
        {
           pathCognition &&
           <div
             className={classnames(styles.boxReturn, styles.fontReturn)}
             onClick={this._handleClick_selfClose}
             onMouseEnter={this._handleEnter_Focus}
             onMouseLeave={this._handleLeave_Focus}>
             {
               this.state.onFocus &&
               <span style={{
                   width: '75%', position: 'absolute', top: '-11%', right: '2%',
                   borderBottom: 'solid 1px rgb(64, 133, 160)'
                 }}/>
               }
             <span
               style={(this.state.onFocus)? {color: '#333333'}:{}}>{"focus"}</span>
           </div>
        }
        <div
          className={classnames(styles.boxAccount, styles.fontAccount)}
          onClick={this._handleClick_selfCover}
          onMouseEnter={this._handleEnter_Account}
          onMouseLeave={this._handleLeave_Account}>
          {
            this.state.onAccount &&
            <span style={{
                width: '75%', position: 'absolute', top: '-11%', right: '2%',
                borderBottom: 'solid 1px rgb(64, 133, 160)'
              }}/>
            }
          <AccountPlate
            size={'layer'}
            accountFisrtName={this.props.userInfo.firstName}
            accountLastName={this.props.userInfo.lastName}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavSelf));
