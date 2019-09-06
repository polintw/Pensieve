import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import UserWindow from '../../Component/Window/UserWindow.jsx';

const styleMiddle = {
  comCosmicUser: {
    height: '', //keep the height depend on Scroll div
  },
  boxScroll: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '73.5%',
    minWidth: '754px',
    position: 'absolute',
    top: '4vh',
    left: '50%',
    transform: 'translate(-51%,0)',
    boxSizing: 'border-box'
  },
}

let windowId='';

class CosmicUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this.style={

    }
  }

  static getDerivedStateFromProps(props, state){
    windowId = props.match.params.userId;
    //here, not in constructor because the component should update if the :userId changed
    //not in componentDidMount because we need it right at the initial mount
    return null; //expect a state update, so return null to update nothing.
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        style={styleMiddle.comCosmicUser}>
        <div
          style={styleMiddle.boxScroll}>
          <UserWindow
            {...this.props}
            windowId={windowId}
            _refer_von_userWindow={this.props._refer_von_cosmic}/>
        </div>
        <div style={{width: '100%', height: '3.3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '54px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
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
