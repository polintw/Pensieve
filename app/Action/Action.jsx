import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {connect} from "react-redux";
import ActionInspired from './Action_Inspired.jsx';

class Action extends React.Component {
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
    return (
      <Router>
        <Switch>
          <Route path="/inspired" render={(props) => <ActionInspired {...props} />} />
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(
  mapStateToProps,
  null
)(Action);
