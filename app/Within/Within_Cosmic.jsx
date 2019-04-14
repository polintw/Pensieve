import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
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
    this.state = {

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

  }

  componentWillUnmount() {

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
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            match={this.props.match}/>
          <div
            style={this.style.Front_Cognition_NavOptions}>
            <NavOptions {...this.props}/>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));
