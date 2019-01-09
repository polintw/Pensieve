import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import LtdNav from './component/LtdNav.jsx';
import LtdUnits from './component/LtdUnits.jsx';
import EntryCall from './component/EntryCall.jsx';

class WithinLtd extends React.Component {
  constructor(props){
    super(props);
    window.scrollTo(0, 0); // special for this page, if the scroll animation is still there.
    this.state = {
      cssPara: 0
    };
    this._check_Position = this._check_Position.bind(this);
    this._refer_leavevonLtd = this._refer_leavevonLtd.bind(this);
    this.style={
      Within_Ltd_: {
        width: '100%',
        height: '100%',
        position: 'absolute'
      },
      Within_Ltd_scroll_: {
        width: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Ltd_scroll_EntryCall: {
        width: '64%',
        height: '21%',
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)'
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
      Within_Ltd_scroll_LtdNav_: {
        width: '100%',
        height: '7%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: "rgba(2,2,2,0.64)"
      },
      Within_Ltd_scroll_LtdNav_light: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      }
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
    window.location.assign('/user/screen');
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
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Within_Ltd_}>
        <div
          ref={(element)=>{this.withinLtd_scroll=element;}}
          style={this.style.Within_Ltd_scroll_}>
          <div
            style={Object.assign({opacity: 1-this.state.cssPara}, this.style.Within_Ltd_scroll_EntryCall)}>
            <EntryCall
              _refer_leavevonLtd={this._refer_leavevonLtd}/>
          </div>
          <div
            ref = {(element)=>{this.ltdUnits = element}}
            style={this.style.Within_Ltd_scroll_LtdUnits}>
            <LtdUnits {...this.props} _refer_leavevonLtd={this._refer_leavevonLtd}/>
          </div>
          <div style={this.style.Within_Ltd_scroll_LtdNav_}>
            <div style={Object.assign({opacity: this.state.cssPara}, this.style.Within_Ltd_scroll_LtdNav_light)}></div>
            <div
              ref={(element)=>{this.Within_Ltd_LtdNav = element}}
              style={{opacity: this.state.cssPara}}>
              <LtdNav
                _refer_leavevonLtd={this._refer_leavevonLtd}/>
            </div>
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
