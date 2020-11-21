import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {connect} from "react-redux";
import WithinAround from './Within_Around.jsx';
import WithinCosmic from './Within_Cosmic.jsx';
import WithinSign from './Within_Sign.jsx';
import WithinSelf from './Within_Self.jsx';

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
    if(this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack'){
      return (
        <Router>
            <Route path="/" render={(props) => <WithinSign {...props} />} />
        </Router>
      )
    }else{
      return(
        <Router>
          <Switch>
            <Route path="/cosmic" render={(props)=> <WithinCosmic {...props}/>}/>
            <Route path="/self" render={(props)=> <WithinSelf {...props}/>}/>
            <Route path="/" render={(props)=> <WithinAround {...props}/>}/>
          </Switch>
        </Router>
      )
    };
  }
}

const mapStateToProps = (state) => {
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
  }
}

export default connect(
  mapStateToProps,
  null
)(Within);
