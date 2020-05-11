import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import IndexWrapper from './Index/Wrapper.jsx';

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
}

class Around extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_Around_: {
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box'
      },
      withinCom_Around_Center: {

      },
      withinCom_Around_filling: {

      }
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
          style={this.style.withinCom_Around_}>
          <div style={Object.assign({}, this.style.withinCom_Around_filling, {width: "10vw"})}/>
          <div
            style={this.style.withinCom_Around_Center}>
            <IndexWrapper {...this.props}/>
            <div
              style={styleMiddle.boxFooterInfo}>

            </div>
          </div>

          <div style={Object.assign({}, this.style.withinCom_Around_filling, {width: "20vw"})}/>
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
