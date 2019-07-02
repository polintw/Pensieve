import React from 'react';
import MainIndex from './MainIndex/MainIndex.jsx';

export default class CosmicMain extends React.Component {
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
        width: '79%',
        position: 'absolute',
        top: '2rem',
        left: '49.5%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box'
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
        <div style={{width: '100%', height: '2.1rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '3.1rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </div>
    )
  }
}
