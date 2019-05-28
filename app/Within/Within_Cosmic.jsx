import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import CosmicMain from './component/CosmicMain.jsx';
import CosmicNoun from './component/CosmicNoun.jsx';
import Explore from './component/Explore.jsx';
import NavOptions from '../Component/NavOptions.jsx';
import CosmicCorner from './component/CosmicCorner/CosmicCorner.jsx';

class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
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
        bottom: '5.8%',
        right: '11%',
        boxSizing: 'border-box'
      },
      Within_Cosmic_NavOptions: {
        width: '1.4%',
        height: '4.2%',
        position: 'fixed',
        bottom: '8.1%',
        right: '3.6%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_von_cosmic(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let switchTo = {
            params: '/nouns/'+identifier,
            query: ''
          };
          return {switchTo: switchTo}
        })
        break;
      default:
        return
    }
  }

  static getDerivedStateFromProps(props, state){
    //It should return an object to update the state, or 'null' to update nothing.
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //set the state back to default if the update came from Redirect
    //preventing Redirect again which would cause error
    if(this.state.switchTo){
      this.setState({
        switchTo: null
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div
        style={this.style.Within_Cosmic_}>
        <div style={this.style.Within_Cosmic_backplane}></div>
        <Switch>
          <Route path={"/nouns/:nounId"} render={(props)=> <CosmicNoun {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>
          <Route path={"/explore"} render={(props)=> <Explore {...props}/>}/>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>
        </Switch>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner {...this.props}/>
        </div>
        <div style={this.style.Within_Cosmic_NavOptions}>
          <NavOptions {...this.props}/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));
