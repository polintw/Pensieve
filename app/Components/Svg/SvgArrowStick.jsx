import React from 'react';

export default class SvgArrowStick extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let class1Style= !!this.props.customstyle ? this.props.customstyle['cls1'] : "{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}";
    let class2Style= !!this.props.customstyle ? this.props.customstyle['cls2'] : "{}";

    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 148.02"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
        })}>
        <defs>
          <style>
            {
              ".cls-1-leftStickArrow" + class1Style  +
              ".cls-2-leftStickArrow" + class2Style
            }
          </style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-2-leftStickArrow" d="M78,148a8,8,0,0,1-5.49-2.18l-70-66a8,8,0,0,1,0-11.64l70-66a8,8,0,0,1,11,11.64L27,74,83.48,134.2A8,8,0,0,1,78,148Z"/>
            <line className="cls-1-leftStickArrow" x1="27" y1="74.01" x2="173" y2="74.01"/>
          </g>
        </g>
      </svg>
    )
  }
}
