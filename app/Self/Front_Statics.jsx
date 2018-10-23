import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Statics from './component/Statics.jsx';

class FrontStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Front_Statics_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        overflowY: "scroll"
      },
      Front_Statics_return_: {
        width: '6%',
        height: '6%',
        position: 'fixed',
        top: '80%',
        right: '9%',
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: '1rem',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        color: '#222222',
        cursor: 'pointer'
      },
      Front_Statics_scroll_: {
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
        style={this.style.Front_Statics_}>
        <Link to={this.props.location.state.from}>
          <div
            style={this.style.Front_Statics_return_}>
            {"return"}
          </div>
        </Link>
        <div
          style={this.style.Front_Statics_scroll_}>
          <Statics/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(FrontStatics));
