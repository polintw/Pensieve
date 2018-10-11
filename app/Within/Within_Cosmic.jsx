import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';
import CosmicUser from './component/CosmicUser.jsx';
import CosmicNoun from './component/CosmicNoun.jsx';

export default class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_corner_: {
        width: '17%',
        height: '5%',
        position: 'fixed',
        top: '92%',
        right: '6%',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Within_Cosmic_}>
        <Switch>
          <Route path={this.props.match.path+"/user"} render={(props)=> <CosmicUser {...props} userBasic={this.props.userBasic}/>}/>
          <Route path={this.props.match.path+"/pick/noun"} render={(props)=> <CosmicNoun {...props} userBasic={this.props.userBasic}/>}/>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props}/>}/>
        </Switch>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            match={this.props.match}
            _set_Pages={this.props._set_Pages}/>
        </div>
      </div>
    )
  }
}
