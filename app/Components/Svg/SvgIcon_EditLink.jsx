import React from 'react';

export default class SvgEditLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85.64 43"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <defs>
          <style>{".cls-1-IconEditLink{fill:none;stroke:#000;stroke-linecap:round;stroke-miterlimit:10;stroke-width:5px;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path
              style={this.props.customStyle["cls-2"]}
              d="M9.22,19.19a12.9,12.9,0,0,1-1.36.57,11.06,11.06,0,0,1-1.56.42c.56.13,1.08.27,1.56.43a8.72,8.72,0,0,1,1.36.59l14.36,7.27a2.14,2.14,0,0,1,.9.73,1.76,1.76,0,0,1,.26.93v4.1L0,21.36V19L24.74,6.16v4.07a1.72,1.72,0,0,1-.26.94,2.13,2.13,0,0,1-.9.72Z"/>
            <path
              style={this.props.customStyle["cls-2"]}
              d="M85.64,19v2.37L60.9,34.23v-4.1a1.76,1.76,0,0,1,.26-.93,2.17,2.17,0,0,1,.89-.73L76.42,21.2a8.72,8.72,0,0,1,1.36-.59c.48-.16,1-.3,1.52-.43a12.16,12.16,0,0,1-2.88-1l-14.37-7.3a2.16,2.16,0,0,1-.89-.72,1.72,1.72,0,0,1-.26-.94V6.16Z"/>
            <line
              className="cls-1-IconEditLink"
              style={this.props.customStyle['cls-1']}
              x1="51.53" y1="2.5" x2="35.53" y2="40.5"/>
          </g>
        </g>
      </svg>
    )
  }
}
