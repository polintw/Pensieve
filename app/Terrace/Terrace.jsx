import React from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  Route
} from 'react-router-dom';
import {connect} from "react-redux";
import Screen from './component/Screen.jsx';


class Terrace extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Self_pages_Terrace_: {
        width: "100%",
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.location.assign('/users/'+identifier+'/accumulated');
        }
        break;
      case 'noun':
        window.location.assign('/nouns/'+identifier);
        break;
      default:
        return
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        ref={(element)=>{this.terrace_=element;}}
        style={this.style.Self_pages_Terrace_}>
        <Screen {...this.props}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const ReduxConnected = withRouter(connect(
  mapStateToProps,
  null
)(Terrace));

//actually, this is like a pair belong to seperated files
//one is the main(Terrace), the other(Router) at heigher level is just a router to trigger the re-render when location has changed.
const RouterWrapper = ()=>{
  return (
    <Router>
      <Route path="/" render={(props)=> <ReduxConnected {...props}/>}/>
    </Router>
  )
}

export default RouterWrapper;
