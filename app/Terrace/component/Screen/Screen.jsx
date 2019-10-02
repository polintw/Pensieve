import React from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';

const styleMiddle = {
  boxOption: {
    position: 'absolute',
    right: '26%',
    boxSizing: 'border-box'
  },
}

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFocus: false,
      onExpand: false
    };
    this._handleEnter_Focus = this._handleEnter_Focus.bind(this);
    this._handleLeave_Focus = this._handleLeave_Focus.bind(this);
    this._handleEnter_Expand = this._handleEnter_Expand.bind(this);
    this._handleLeave_Expand = this._handleLeave_Expand.bind(this);
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      terraceCom_Screen_floor_: {
        width: '90%',
        height: '0',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
        borderBottom: 'solid 45vh rgb(248,248,248)',
        borderLeft: 'solid 15vw transparent'
      },
      terraceCom_Screen_account_name: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: "4.3rem",
        letterSpacing: '0.27rem',
        fontWeight: '400',
        color: '#000000'
      },
      terraceCom_Screen_options_expand: {
        display: 'inline',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/actions/shareds');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleEnter_Expand(e){
    this.setState({
      onExpand: true
    })
  }

  _handleLeave_Expand(e){
    this.setState({
      onExpand: false
    })
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

  render(){
    return(
      <div
        className={classnames('boxAbsoluteFull', styles.comScreen)}>
        <div
          style={this.style.terraceCom_Screen_floor_}/>
        <div
          className={classnames(styles.planeCanvas)}/>
        <div
          className={classnames(styles.boxOptions)}>
          <Link
            to={{
              pathname: "/screen",
              search: "?watch=window",
              hash: "",
              state: {}
            }}
            className={'plainLinkButton'}>
            <span
              className={styles.fontOption}
              style={Object.assign({}, {color: 'black', cursor: 'pointer'})}>
              {"window"}
            </span>
          </Link>
          <div
            className={styles.fontOption}
            style={Object.assign({}, this.style.terraceCom_Screen_options_expand)}
            onClick={this._handleClick_nav_expand}
            onMouseEnter={this._handleEnter_Expand}
            onMouseLeave={this._handleLeave_Expand}>
            {
              this.state.onExpand &&
              <span style={{
                  width: '56%', position: 'absolute', bottom: '-20%', right: '8%',
                  borderBottom: 'solid 1px rgb(64, 133, 160)'
                }}/>
              }
            <span style={{color: this.state.onExpand? "rgb(0,0,0)": "#000000"}}>{"ex"}</span>
            <span style={this.state.onExpand ? {color: 'rgb(0,0,0)'}: {}}>{"pand"}</span>
          </div>
        </div>
        <div
          className={classnames(styles.boxReturnSet)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/cosmic')}}>
            <SvgLogo/>
          </div>
          <div
            className={classnames(styles.boxReturn, styles.fontReturn)}
            onClick={this._handleClick_selfClose}
            onMouseEnter={this._handleEnter_Focus}
            onMouseLeave={this._handleLeave_Focus}>
            {
              this.state.onFocus &&
              <span style={{
                  width: '75%', position: 'absolute', bottom: '-16%', right: '2%',
                  borderBottom: 'solid 1px rgb(64, 133, 160)'
                }}/>
              }
            <span
              style={(this.state.onFocus)? {color: '#333333'}:{}}>{"focus"}</span>
          </div>
        </div>
        <div
          className={classnames(styles.boxAccount)}>
          <span style={this.style.terraceCom_Screen_account_name}>{this.props.userInfo.firstName+" "+this.props.userInfo.lastName}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(Screen);
