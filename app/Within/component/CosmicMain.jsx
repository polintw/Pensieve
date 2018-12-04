import React from 'react';
import cxBind from 'classnames/bind';
import MainIndex from './MainIndex.jsx';
import EntryCall from './EntryCall.jsx';

export default class CosmicMain extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_CosmicMain_: {
        width: '75%',
        position: 'absolute',
        top: '0',
        left: '10%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_picking_: {
        width: '21%',
        height: '6vh',
        position: 'fixed',
        top: '1vh',
        right: '0%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_picking_nouns_: {
        width: '45%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_picking_nouns_svg: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_index_: {
        width: '100%',
        position: 'absolute',
        top: '8vh',
        left: '0',
        boxSizing: 'border-box'
      },
      Within_Ltd_scroll_EntryCall: {
        width: '64%',
        height: '21%',
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)'
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
          style={this.style.Within_Ltd_scroll_EntryCall}>
            <EntryCall
              _refer_leavevonIndex={this.props._refer_leavevonIndex}/>
        </div>
        <div
          style={this.style.withinCom_CosmicMain_index_}>
          <MainIndex {...this.props}/>
        </div>
      </div>
    )
  }
}
