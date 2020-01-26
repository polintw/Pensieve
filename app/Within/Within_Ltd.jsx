import React from 'react';
import {
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import LtdUnits from './component/LtdUnits.jsx';

class WithinLtd extends React.Component {
  constructor(props){
    super(props);
    window.scrollTo(0, 0); // special for this page, if the scroll animation is still there.
    this.state = {
      cssPara: 0,
      unitTo: null
    };
    this._check_Position = this._check_Position.bind(this);
    this._refer_leavevonLtd = this._refer_leavevonLtd.bind(this);
    this.style={
      Within_Ltd_: {
        width: '100%',
        height: '100%',
        position: 'absolute'
      },
      Within_Ltd_Background_: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        backgroundColor: 'rgba(205, 198,198,0.66)'
      },
      Within_Ltd_scroll_: {
        width: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Ltd_scroll_night: {
        width: '100%',
        height: '93%',
        position: 'fixed',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: "rgba(2,2,2,0.64)"
      },
      Within_Ltd_scroll_dawn_: {
        width: '100%',
        position: 'fixed',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: "#e0dcdc"
      },
      Within_Ltd_scroll_dawn_fly_: {
        width: '10%',
        position: 'absolute',
        top: '50%',
        left: '88%',
        transform: 'translate(0, -50%)'
      },
      Within_Ltd_scroll_dawn_fly_svg: {
        width: '100%',
        boxSizing: 'border-box'
      },
      Within_Ltd_scroll_LtdUnits: {
        width: '74%',
        minHeight: '110%',
        position: 'absolute',
        top: '28%',
        left: '51%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box'
      },
    }
  }

  _check_Position(){
    let ltdUnitsTop = this.ltdUnits.getBoundingClientRect().top;
    if(ltdUnitsTop < this.scrollOrigin && ltdUnitsTop > this.scrollLine){
      //it's not good enough, due to the "leap" happened at the threshould
      let para = (this.scrollOrigin-ltdUnitsTop)/this.scrollRange;
      this.setState((prevState, props) => {
        return ({
          cssPara: para,
        })
      })
    }
  }

  _refer_leavevonLtd(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          this.setState((prevState, props)=>{
            let unitTo = {
              params: '/cosmic/users/'+identifier+'/accumulated',
              query: ''
            };
            return {unitTo: unitTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let unitTo = {
            params: '/cosmic/nodes/'+identifier,
            query: ''
          };
          return {unitTo: unitTo}
        })
        break;
      case 'reload':
        window.location.reload(true);
        break;
      default:
        return
    }
  }

  componentDidMount() {
    this.scrollOrigin = this.ltdUnits.getBoundingClientRect().top;
    this.scrollRange = this.scrollOrigin*4.5;
    this.scrollLine = this.scrollOrigin-this.scrollRange;
    window.addEventListener("scroll", this._check_Position); //becuase we using "position: static", listener could not add on element directlly.
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this._check_Position);
  }

  render(){
    if(this.state.unitTo){return <Redirect to={this.state.unitTo.params+this.state.unitTo.query}/>}
    return(
      <div
        style={this.style.Within_Ltd_}>
        <div
          ref={(element)=>{this.withinLtd_scroll=element;}}
          style={this.style.Within_Ltd_scroll_}>
          <div
            style={this.style.Within_Ltd_Background_}/>
          <div
            style={this.style.Within_Ltd_scroll_night}/>

          <div
            ref = {(element)=>{this.ltdUnits = element}}
            style={this.style.Within_Ltd_scroll_LtdUnits}>
            <LtdUnits {...this.props} _refer_leavevonLtd={this._refer_leavevonLtd}/>
          </div>

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
)(WithinLtd));
