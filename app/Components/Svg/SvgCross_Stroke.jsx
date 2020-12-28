import React from 'react';

export default class SvgCrossStroke extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326.64 338.5"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <defs>
          <style>{".cls-1{fill:none;stroke-linecap:round;stroke-linejoin:round;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <line
              className="cls-1"
              style={this.props.crossStyle}
              x1="7" y1="169.25" x2="319.64" y2="169.25"/>
            <line
              className="cls-1"
              style={this.props.crossStyle}
              x1="163.32" y1="331.5" x2="163.32" y2="7"/>
          </g>
        </g>
      </svg>
    )
  }
}
