import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';

class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    window.scrollTo(0, 0); // special for this page, if the scroll animation is still there.
    this.state = {
      cssPara: 0
    };
    this._check_Position = this._check_Position.bind(this);
    this._refer_leavevonIndex = this._refer_leavevonIndex.bind(this);
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_corner_: {
        width: '18%',
        minHeight: '20%',
        position: 'fixed',
        bottom: '5%',
        right: '0',
        boxSizing: 'border-box'
      },
      Within_Cosmic_bottom: {
        width: '100%',
        height: '4%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      }
    }
  }

  _refer_leavevonIndex(identifier, route){
    switch (route) {
      case 'user':
        window.location.assign('/user/screen');
        break;
      default:
        window.location.reload();
    }
  }

  _check_Position(){
    let Within_Cosmic_corner_Top = this.Within_Cosmic_corner_.getBoundingClientRect().top;
    if(Within_Cosmic_corner_Top < this.scrollOrigin && Within_Cosmic_corner_Top > this.scrollLine){
      //it's not good enough, due to the "leap" happened at the threshould
      let para = (this.scrollOrigin-Within_Cosmic_corner_Top)/this.scrollRange;
      this.setState((prevState, props) => {
        return ({
          cssPara: para
        })
      })
    }
  }
  componentDidMount() {
    this.scrollOrigin = this.Within_Cosmic_corner_.getBoundingClientRect().top;
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
        style={this.style.Within_Cosmic_}>
        <CosmicMain {...this.props} _refer_leavevonIndex={this._refer_leavevonIndex}/>
        <div style={this.style.Within_Cosmic_bottom}></div>
        <div
          style={Object.assign({opacity: this.state.cssPara}, this.style.Within_Cosmic_corner_)}
          ref = {(element)=>{this.Within_Cosmic_corner_ = element}}>
          <CosmicCorner
            match={this.props.match}
            _refer_leavevonIndex={this._refer_leavevonIndex}/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));
