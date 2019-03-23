import React from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  Route
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Screen from './component/Screen.jsx';
import Appearance from '../Component/Appearance.jsx';


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
      },
      Self_pages_Terrace_hidden_appearance: {
        width: '60%',
        position: 'absolute',
        top: '10%',
        left: '20%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.location.assign('/cosmic/people/'+identifier);
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nouns/'+identifier);
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
    //let cx = cxBind.bind(styles);
    const params = new URLSearchParams(this.props.location.search); //query value
    let paramWatch = params.get('watch');

    return(
      <div
        ref={(element)=>{this.terrace_=element;}}
        style={this.style.Self_pages_Terrace_}>
        {
          paramWatch== 'appearance'?(
            <div
              style={this.style.Self_pages_Terrace_hidden_appearance}>
              <Appearance {...this.props} urlParam={"/router/user/cover"} urlQuery={"?id="+this.props.userInfo.id} _refer_von_unit={this._refer_leaveSelf}/>
            </div>
          ):(
            <Screen {...this.props}/>
          )
        }
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
