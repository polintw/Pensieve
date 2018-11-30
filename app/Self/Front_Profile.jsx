import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Sheet from './component/Sheet.jsx';

class FrontProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Front_Profile_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        overflowY: "scroll"
      },
      Front_Profile_return_: {
        width: '6%',
        height: '6%',
        position: 'fixed',
        top: '90%',
        right: '2%',
        boxSizing: 'border-box',
        borderBottom: '1px solid black',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        color: '#222222',
        cursor: 'pointer'
      },
      Front_Profile_scroll_: {
        width: '68%',
        position: 'absolute',
        top: '0',
        left: '15%',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Profile_}>
        <Link to={this.props.location.state.from?this.props.location.state.from:'/cognition/embedded/inspired'}>
          <div
            style={this.style.Front_Profile_return_}>
            {"return"}
          </div>
        </Link>
        <div
          style={this.style.Front_Profile_scroll_}>
          <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}
export default withRouter(connect(
  mapStateToProps,
  null
)(FrontProfile));
