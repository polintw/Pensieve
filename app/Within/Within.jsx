import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {connect} from "react-redux";
import WithinAround from './Within_Around.jsx';
import WithinCosmic from './Within_Cosmic.jsx';

class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  render(){
    return(
      <Router>
        <Switch>
          <Route path="/cosmic" render={(props)=> <WithinCosmic {...props}/>}/>
          <Route path="/" render={(props)=> <WithinAround {...props}/>}/>
        </Switch>
      </Router>
    )
  }
}

export default connect()(Within);
