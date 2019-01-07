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
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/overview');
        }else{
          this.setState((prevState, props)=>{
            let unitTo = {
              params: '/cosmic/people/'+identifier,
              query: ''
            };
            return {unitTo: unitTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let unitTo = {
            params: '/cosmic/nouns/'+identifier,
            query: ''
          };
          return {unitTo: unitTo}
        })
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
    //let cx = cxBind.bind(styles);
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
            ref={(element)=>{this.ltdTop = element}}
            style={Object.assign({height: (33-(this.state.cssPara*28))+"%", top: (this.state.cssPara*18)+'%'},this.style.Within_Ltd_scroll_dawn_)}>
            <div
              style={this.style.Within_Ltd_scroll_dawn_fly_}>
              <svg
                style={this.style.Within_Ltd_scroll_dawn_fly_svg}>
                <Link to="/cosmic">
                  <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
                </Link>
              </svg>
            </div>
          </div>
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
