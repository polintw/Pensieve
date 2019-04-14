import React from 'react';
import MainIndex from './MainIndex.jsx';
import EntryCall from './EntryCall.jsx';

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
        width: '932px',
        position: 'absolute',
        top: '4vh',
        left: '48%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box'
      },
      Within_Ltd_scroll_EntryCall: {
        width: '97%',
        height: '15vh',
        position: 'absolute',
        top: '3vh',
        left: '5%'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicMain_}>
        <div
          style={this.style.withinCom_CosmicMain_index_}>
          <MainIndex {...this.props} _refer_von_cosmic={this.props._refer_von_cosmic}/>
        </div>
        <div style={{width: '100%', height: '3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '6vh', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => <CosmicMain innerRef={ref} {...props}/>);
