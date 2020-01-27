import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import WithinAround from './Within_Around.jsx';
import WithinCosmic from './Within_Cosmic.jsx';

class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  render(){
    return(
      <Router>
        <div>
          <Switch>
            <Route path="/cosmic" render={(props)=> <WithinCosmic {...props}/>}/>
            <Route path="/" render={(props)=> <WithinAround {...props}/>}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect()(Within);
