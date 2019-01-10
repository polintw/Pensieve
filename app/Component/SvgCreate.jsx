import React from 'react';

export default class SvgCreate extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 266 89.5"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        preserveAspectRatio="none">
            <defs><style>{".cls-1,.cls-2,.cls-3{fill:none;stroke-miterlimit:10;}.cls-1,.cls-2{stroke:#000;}.cls-2{stroke-dasharray:8 4;}.cls-3{stroke:#6d6d6d;opacity:0.61;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
                <g id="圖層_1-2" data-name="圖層 1">
                    <line className="cls-1" x1="265.5" y1="14.5" x2="265.5" y2="18.5"/>
                    <line className="cls-2" x1="265.5" y1="22.5" x2="265.5" y2="68.5"/>
                    <line className="cls-1" x1="265.5" y1="70.5" x2="265.5" y2="74.5"/>
                    <path className="cls-1" d="M.5,74.5v-55a19.06,19.06,0,0,1,19-19h227"/>
                    <line className="cls-3" x1="36.5" y1="89" x2="229.5" y2="89"/>
                </g>
            </g>
      </svg>
    )
  }
}
