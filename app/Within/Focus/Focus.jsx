import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Main from './Main/Main.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';

class CosmicMain extends React.Component {
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
      withinCom_CosmicMain_top_logo: {
        display: 'inline-block',
        height: '12px',
        position: 'absolute',
        top: '39%',
        left: '25%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }
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
          style={this.style.withinCom_CosmicMain_index_}>
          <Main {...this.props}/>
        </div>
        <div style={{width: '100%', height: '2.7rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}>
          <div
            style={Object.assign({}, this.style.withinCom_CosmicMain_top_logo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
            <SvgLogo/>
          </div>
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

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CosmicMain));
