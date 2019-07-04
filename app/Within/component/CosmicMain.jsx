import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import MainIndex from './MainIndex/MainIndex.jsx';
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
        width: '76%',
        position: 'absolute',
        top: '3.6rem',
        left: '49%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_top_logo: {
        display: 'inline-block',
        height: '37%',
        position: 'absolute',
        top: '25%',
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
          <MainIndex {...this.props}/>
        </div>
        <div style={{width: '100%', height: '3.42rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}>
          <div
            style={Object.assign({}, this.style.withinCom_CosmicMain_top_logo, {opacity: this.props.mainTitle})}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
            <SvgLogo/>
          </div>
        </div>
        <div style={{width: '100%', height: '3.4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    mainTitle: state.mainTitle
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicMain));
