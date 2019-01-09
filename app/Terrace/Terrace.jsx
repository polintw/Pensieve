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
      },
      Self_pages_Terrace_decoration_: {
        width: '13%',
        height: '60%',
        position: 'fixed',
        top: '12%',
        left: '17%'
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
        <div
          style={this.style.Self_pages_Terrace_decoration_}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.5 356.5"
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}>
            <defs><style>{".cls-1{fill:none;stroke:#aaa;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2"><g id="圖層_2-2" data-name="圖層 2">
              <line className="cls-1" x1="1" y1="355.5" x2="1" y2="1"/>
              <line className="cls-1" x1="81.5" y1="315.5" x2="1" y2="355.5"/>
            </g></g>
          </svg>
        </div>
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
