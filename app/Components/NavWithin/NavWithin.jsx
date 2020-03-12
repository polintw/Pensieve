import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../Svg/SvgLogo.jsx';
import AccountPalette from '../AccountPalette.jsx';

class NavWithin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
  }

  _handleEnter_CornerOpt(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //detect where I am now, for styling
    let subPath = this.props.location.pathname.substring(8, 11);
    //pathNow is a INT indicate the index refer to this.abbrRoute
    //default should be -1, page Main(not in abbrRoute)
    let pathNow = this.abbrRoute.indexOf(subPath);


    return(
      <div
        className={classnames(styles.comNavWithin)}>
        <div
          method="back"
          className={
            classnames(
              styles.boxOptions,
              styles.fontCosmicCorner,
              styles.boxBack,
              {[styles.specificNoneDis]: (this.props.location.pathname.indexOf('profile') < 0)} /*Notice! it's just a imformal method*/
            )
          }
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          {
            (this.state.mouseOn=='around') &&
            <span style={{
                width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                borderBottom: 'solid 1px rgb(64, 133, 160)'
              }}/>
            }
            <span
              style={(this.state.mouseOn=='all')? {color: '#333333'}:{}}>{"back"}</span>
        </div>

        <div
          method="account"
          className={
            classnames(
              styles.boxOptions,
              styles.fontCosmicCorner,
              {[styles.boxAccount]: (pathNow==this.abbrRoute.indexOf('exp') || pathNow< 0)}
            )
          }
          style={(pathNow> 2)? {transform: 'translate(-50%, 0%)'}: {}}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/self/profile/sheet')}}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          {
            (this.state.mouseOn=='account') &&
            <span style={{
                width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                borderBottom: 'solid 1px #ff7a5f'
              }}/>
            }
            <AccountPalette
              size={'regular'}
              accountFirstName={this.props.userInfo.firstName}
              accountLastName={this.props.userInfo.lastName}
              styleFirst={{fontWeight: '600'}}/>
        </div>
        <div
          className={classnames(styles.boxLogo)}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
          <SvgLogo/>
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
)(NavWithin);
