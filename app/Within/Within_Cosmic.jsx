import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';
import NavOptions from './component/NavOptions.jsx';

class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    window.scrollTo(0, 0); // special for this page, if the scroll animation is still there.
    this.state = {
      cssPara: 0
    };
    this._refer_von_cosmic = this._refer_von_cosmic.bind(this);
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
      Within_Cosmic_corner_: {
        position: 'fixed',
        bottom: '3%',
        right: '11%',
        boxSizing: 'border-box'
      },
      Front_Cognition_NavOptions: {
        width: '1.4%',
        height: '4.2%',
        position: 'fixed',
        bottom: '5.5%',
        right: '5%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_von_cosmic(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.reload();
        }
        break;
      default:
        return
    }
  }

  componentDidMount() {

  _check_Position(){
    let Within_Cosmic_corner_Top = this.withinCom_CosmicMain_index_.current.getBoundingClientRect().top;
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

  _handleClick_LtdToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.assign('/login');
  }

  componentDidMount() {
    this.scrollOrigin = this.withinCom_CosmicMain_index_.current.getBoundingClientRect().top;
    this.scrollRange = this.scrollOrigin*2;
    this.scrollLine = this.scrollOrigin-this.scrollRange;
    window.addEventListener("scroll", this._check_Position); //becuase we using "position: static", listener could not add on element directlly.
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this._check_Position);
  }

  render(){
    return(
      <div
        style={this.style.Within_Cosmic_}>
        <div style={this.style.Within_Cosmic_backplane}></div>
        <Switch>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>
        </Switch>
        <div
          style={Object.assign({opacity: this.state.cssPara}, this.style.Within_Cosmic_corner_)}>
          <CosmicCorner
            match={this.props.match}/>
          <div
            style={this.style.Front_Cognition_NavOptions}>
            <NavOptions {...this.props}/>
          </div>
        </div>
        <CosmicMain
          {...this.props}
          ref={this.withinCom_CosmicMain_index_}
          _refer_leavevonIndex={this._refer_leavevonIndex}
          _handleClick_LtdToolBox_logout={this._handleClick_LtdToolBox_logout}/>
        <div style={this.style.Within_Cosmic_bottom}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(WithinCosmic));
