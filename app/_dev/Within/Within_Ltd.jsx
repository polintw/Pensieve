import React from 'react';
import cxBind from 'classnames/bind';
import LtdNav from './component/LtdNav.jsx';
import LtdUnits from './component/LtdUnits.jsx';
import EntryCall from './component/EntryCall.jsx';

export default class WithinLtd extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      NavMaskOpa: 0,
      scrollYLast: 0
    };
    this._check_Position = this._check_Position.bind(this);
    this.style={
      Within_Ltd_: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        overflow: 'auto'
      },
      Within_Ltd_LtdUnits: {
        width: '64%',
        minHeight: '110%',
        position: 'absolute',
        top: '46%',
        left: '50%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box'
      },
      Within_Ltd_LtdNav_: {
        width: '100%',
        height: '8%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Within_Ltd_LtdNav_paint: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        top: '92%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      },
      Within_Ltd_Background_: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0'
      },
      Within_Ltd_top_: {
        width: '100%',
        height: '92%',
        position: 'absolute',
        top: '0'
      },
      Within_Ltd_top_solid_: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: '0',
        backgroundColor: '#FAFAFA'
      },
      Within_Ltd_top_solid_EntryCall: {
        width: '64%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)'
      }
    }
  }

  _check_Position(){
    let ltdUnitsTop = this.ltdUnits.getBoundingClientRect().top;
    if(ltdUnitsTop < this.scrollOrigin && ltdUnitsTop > this.scrollLine){
      let opa = (this.scrollOrigin-ltdUnitsTop)*0.48/this.scrollRange;
      this.setState((prevState, props) => {
        return ({
          NavMaskOpa: opa,
          scrollYLast: ltdUnitsTop
        })
      })
    }
  }

  componentDidMount() {
    this.scrollOrigin = this.ltdUnits.getBoundingClientRect().top;
    this.scrollRange = this.scrollOrigin*7/5;
    this.scrollLine = this.scrollOrigin-this.scrollRange;
    this.setState({scrollYLast: this.ltdUnits.getBoundingClientRect().top})
    document.getElementById('view_WithinLtd').addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount() {
    document.getElementById('view_WithinLtd').removeEventListener("scroll", this._check_Position);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        id='view_WithinLtd'
        style={this.style.Within_Ltd_}>
        <div
          style={this.style.Within_Ltd_Background_}>
          <div style={{width: '100%', height: '38%', position: 'relative', backgroundColor: 'rgba(70, 70, 70, 0.5)'}}></div>
          <div style={{width: '100%', height: '62%', position: 'relative', backgroundColor: '#FAFAFA'}}></div>
        </div>
        <div
          style={this.style.Within_Ltd_top_}>
          <div style={this.style.Within_Ltd_top_solid_}>
            <div
              style={this.style.Within_Ltd_top_solid_EntryCall}>
              <EntryCall/>
            </div>
          </div>
          <div style={{width: '100%', height: '50%', position: 'absolute', top: '50%', backgroundColor: '#FAFAFA'}}></div>
          <div
            ref={(element) => {this.mask = element}}
            style={{width: '100%', height: '50%', position: 'absolute', top: '50%', backgroundColor: 'rgba(70,70,70,0.5)'}}>
          </div>
        </div>
        <div
          ref = {(element)=>{this.ltdUnits = element}}
          style={this.style.Within_Ltd_LtdUnits}>
          <LtdUnits/>
        </div>
        <div style={Object.assign({backgroundColor: '#FAFAFA'}, this.style.Within_Ltd_LtdNav_)}>
          <div style={Object.assign({backgroundColor: 'rgba(70,70,70,'+this.state.NavMaskOpa+')'}, this.style.Within_Ltd_LtdNav_)}></div>
          <div
            ref={(element)=>{this.Within_Ltd_LtdNav = element}}
            style={Object.assign({backgroundColor: 'transparent'}, this.style.Within_Ltd_LtdNav_)}>
            <LtdNav/>
          </div>
        </div>
      </div>
    )
  }
}
