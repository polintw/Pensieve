import React from 'react';
import cxBind from 'classnames/bind';
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';

export default class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_corner_: {
        width: '17%',
        height: '5%',
        position: 'fixed',
        top: '92%',
        right: '6%',
        boxSizing: 'border-box'
      },
      Within_Cosmic_Main_: {
        width: '75%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '10%',
        boxSizing: 'border-box',
        overflow: 'visible'
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
        style={this.style.Within_Cosmic_}>
        <div
          style={this.style.Within_Cosmic_Main_}>
          <CosmicMain/>
        </div>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            _set_Pages={this.props._set_Pages}/>
        </div>
      </div>
    )
  }
}
