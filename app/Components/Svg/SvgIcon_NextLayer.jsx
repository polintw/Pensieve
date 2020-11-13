import React from 'react';

export default class SvgIconNextLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let class1Style = !!this.props.customstyle ? this.props.customstyle['cls1'] : "{fill:none;}";
    let class2Style= !!this.props.customstyle ? this.props.customstyle['cls2'] : "{fill: #545454}";

    return(
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
        })}>
    <defs>
          <style>
            {
              ".cls-1-nextLayer" + class1Style  +
              ".cls-2-nextLayer" + class2Style
            }
          </style>
    </defs>
    <g id="圖層_2" data-name="圖層 2">
        <g id="圖層_1-2" data-name="圖層 1">
            <circle className="cls-1-nextLayer" cx="106" cy="106" r="106"/>
            <path className="cls-2-nextLayer" d="M175.5,85H36.5a7.5,7.5,0,0,1,0-15h139a7.5,7.5,0,0,1,0,15Z"/>
            <path className="cls-2-nextLayer"d="M66.5,142h-30a7.5,7.5,0,0,1,0-15h30a7.5,7.5,0,0,1,0,15Z"/>
            <path className="cls-2-nextLayer"d="M176,142.5H146a7.5,7.5,0,0,1,0-15h30a7.5,7.5,0,0,1,0,15Z"/>
            <path className="cls-2-nextLayer"d="M121,142.5H91a7.5,7.5,0,0,1,0-15h30a7.5,7.5,0,0,1,0,15Z"/>
        </g>
    </g>
</svg>
      )
    }
}
