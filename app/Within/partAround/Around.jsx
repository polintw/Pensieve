import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import IndexWrapper from './Index/Wrapper.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';
import ServiceLinks from '../../Components/ServiceLinks.jsx';

const styleMiddle = {
  boxFooterInfo: {
    alignSelf: 'flex-end',
    width: "100%",
    height: "33vh",
    position: "relative",
    boxSizing: "border-box",
    margin: '4.2rem 0 1.6rem',
    padding: '2rem 1.2rem 0',
    color: '#ababab'
  },
  spanFooterInfo: {
    display: 'inline-block',
    boxSizing: 'border-box',
    marginRight: '0.42rem'
  },
  textFooterInfo: {
    fontSize: '1.21rem',
    letterSpacing: '0.1rem',
  }
}

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
        width: '64vw',
        minWidth: '854px',
        position: 'absolute',
        top: '3.4rem',
        left: '18vw',
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
            <div
              style={styleMiddle.boxFooterInfo}>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"Cornerth."}</span>
              <br></br>
              <br></br>
              <ServiceLinks/>
            </div>
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
