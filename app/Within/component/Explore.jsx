import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import ExploreNouns from './ExploreNouns.jsx';

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxMain: {
    width: '936px',
    position: 'absolute',
    top: '4vh',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  }
}

class Explore extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
        style={styleMiddle.comExplore}>
        <div
          style={styleMiddle.boxMain}>
          <div>
            <ExploreNouns/>
          </div>
        </div>
        <div style={{width: '100%', height: '4vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '57px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
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
)(Explore));
