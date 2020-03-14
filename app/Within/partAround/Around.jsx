import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import IndexWrapper from './Index/Wrapper.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';

class Around extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_CosmicMain_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_index_: {
        width: '80vw',
        minWidth: '890px',
        position: 'absolute',
        top: '3.4rem',
        left: '15vw',
        boxSizing: 'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    if (this.props.tokenStatus == 'invalid' || this.props.tokenStatus == 'lack') {
      return (
        <div
          style={this.style.withinCom_CosmicMain_}>

          <div style={{ width: '100%', height: '2.7rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC' }}></div>
          <div style={{ width: '100%', height: '4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC' }}>
          </div>
        </div>
      )
    } else {
      return(
        <div
          style={this.style.withinCom_CosmicMain_}>
          <div
            style={this.style.withinCom_CosmicMain_index_}>
            <IndexWrapper {...this.props}/>
          </div>
          <div style={{width: '100%', height: '2.7rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
          <div style={{width: '100%', height: '4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}>
          </div>
        </div>
      )
    };
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Around));
