import React from 'react';
import cxBind from 'classnames/bind';
import WithinLtd from './Within_Ltd.jsx';

export default class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic
    };
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Within_pages_WithinLtd: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    };
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.div_Base}>
        <div
          style={this.style.Within_pages_WithinLtd}>
          <WithinLtd
            userBasic={this.state.userBasic}/>
        </div>
      </div>
    )
  }
}
