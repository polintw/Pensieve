import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import UserWindow from './Component/Window/UserWindow.jsx';

const styleMiddle = {
  comNounSingular: {

  },
  boxScroll: {
    width: '932px',
    position: 'absolute',
    top: '5.8vh',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
}

class CosmicUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.withinCom_CosmicMain_}>
        <div
          style={styleMiddle.boxScroll}>
          <UserWindow {...props}/>
        </div>
        <div style={{width: '100%', height: '3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '2.4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicUser));
