import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';
import CosmicUser from './component/CosmicUser.jsx';
import CosmicNoun from './component/CosmicNoun.jsx';
import CosmicRelated from './component/CosmicRelated.jsx';

class WithinCosmic extends React.Component {
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
          <Route path={this.props.match.path+"/people/:id"} render={(props)=> <CosmicUser {...props}/>}/>
          <Route path={this.props.match.path+"/nouns/:id"} render={(props)=> <CosmicNoun {...props}/>}/>
          <Route path={this.props.match.path+"/units/:id/related"} render={(props)=> <CosmicRelated {...props}/>}/>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props}/>}/>
        </Switch>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            match={this.props.match}/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));
