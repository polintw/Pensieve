import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import WithinLtd from './Within_Ltd.jsx';
import WithinCosmic from './Within_Cosmic.jsx';

export default class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic
    };
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    };
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <Router>
        <div
          style={this.style.div_Base}>
          <Switch>
            <Route path="/cosmic" render={(props)=> <WithinCosmic {...props} userBasic={this.state.userBasic}/>}/>
            <Route path="/" render={(props)=> <WithinLtd {...props} userBasic={this.state.userBasic}/>}/>
          </Switch>
        </div>
      </Router>
    )
  }
}
