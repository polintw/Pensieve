import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import WithinLtd from './Within_Ltd.jsx';
import WithinCosmic from './Within_Cosmic.jsx';

class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic
    };
    this.style={

    };
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <Router>
        <div>
          <Switch>
            <Route path="/cosmic" render={(props)=> <WithinCosmic {...props}/>}/>
            <Route path="/" render={(props)=> <WithinLtd {...props}/>}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect()(Within);
