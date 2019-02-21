import React from 'react';
import cxBind from 'classnames/bind';
import MainIndex from './MainIndex.jsx';
import EntryCall from './EntryCall.jsx';

class CosmicMain extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_CosmicMain_: {
        width: '75%',
        minHeight: '150%',
        position: 'absolute',
        top: '0',
        left: '14%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicMain_index_: {
        width: '100%',
        position: 'absolute',
        top: '23vh',
        left: '0',
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
          style={this.style.Within_Ltd_scroll_EntryCall}>
            <EntryCall
              _refer_leavevonIndex={this.props._refer_leavevonIndex}
              _handleClick_LtdToolBox_logout={this.props._handleClick_LtdToolBox_logout}/>
        </div>
        <div
          ref={this.props.innerRef}
          style={this.style.withinCom_CosmicMain_index_}>
          <MainIndex {...this.props}/>
        </div>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => <CosmicMain innerRef={ref} {...props}/>);
