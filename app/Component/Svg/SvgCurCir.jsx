import React from 'react';

export default class SvgCurCir extends React.Component {
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
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 58.35 59.85"
        style={{
          width: '100%',
          height: 'auto'
        }}>
        <defs>
          <style>
            {".cls-1-CurCir,.cls-2-CurCir{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px;}.cls-1-CurCir{stroke:url(#未命名漸層_26);}.cls-2-CurCir{stroke:#fff;}"}
          </style>
          <radialGradient id="未命名漸層_26" cx="30.17" cy="31.36" r="28.33" gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#fff" stopOpacity="0"/>
            <stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/>
            <stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/>
            <stop offset="1" stopColor="#787759"/>
          </radialGradient>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path className="cls-1-CurCir" d="M5.5,6.38,52,27c1.88.84,2.83,1.58,2.83,4.35s-1,3.52-2.83,4.36L5.5,56.35"/>
            <path className="cls-2-CurCir" d="M3.5,3.5,51.1,24.62c1.93.86,2.9,1.61,2.9,4.45s-1,3.6-2.9,4.46L3.5,54.65"/>
          </g>
        </g>
      </svg>
    )
  }
}
