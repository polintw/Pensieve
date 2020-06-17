import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import FrontProfile from './Front_Profile.jsx';

class Front extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <Router
        basename={"/self"}>
        <Route path="/profile" render={(props)=> <FrontProfile {...props}/>}/>

      </Router>
    )
  }
}

export default connect()(Front);
