import React from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  Route
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
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
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        overflowY: 'scroll'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    window.location.assign('/user/screen');
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
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
