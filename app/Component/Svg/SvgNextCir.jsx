import React from 'react';

export default class SvgNextCir extends React.Component {
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
        viewBox="0 0 93 62.67"
        style={{
          width: '100%',
          height: 'auto'
        }}>
        <defs>
          <style>{".cls-1-NextCir{opacity:0.65;}.cls-2-NextCir{fill:url(#未命名漸層_26);}.cls-3-NextCir,.cls-5-NextCir{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px;}.cls-3-NextCir{stroke:url(#未命名漸層_26-2);}"}</style>
          <radialGradient id="未命名漸層_26" cx="76.88" cy="32.34" r="24.29" gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#fff" stopOpacity="0"/>
            <stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/>
            <stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/>
            <stop offset="1" stopColor="#787759"/>
          </radialGradient>
          <radialGradient id="未命名漸層_26-2" cx="30.17" cy="33.26" r="28.33" xlinkHref="#未命名漸層_26"/>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <g className="cls-1-NextCir">
              <path className="cls-2-NextCir" d="M63.69,2c-1,0-2-.09-2.94,0,1.15.93,3,3.73,4,4.79C78.46,7.07,88.11,18,88.11,32.34s-9.65,25.27-23.35,25.5c-1,1.06-2.86,3.86-4,4.79.94.09,2,0,2.94,0C79.24,62.63,93,48.53,93,32.34S79.24,2,63.69,2Z"/>
              <path className="cls-3-NextCir" d="M5.5,8.28,52,28.91c1.88.84,2.83,1.58,2.83,4.35s-1,3.52-2.83,4.35L5.5,58.25"/>
            </g>
            <path
              style={{
                fill: this.props.pathStyle.fill
              }}
              d="M61,0c-1,0-2-.1-3,0,1.18,1,3,3.81,4.1,4.9C76.12,5.18,86,16.39,86,31S76.12,56.91,62.1,57.15c-1.05,1.09-2.92,4-4.1,4.89a27.29,27.29,0,0,0,3,0c15.92,0,30-14.43,30-31S76.92,0,61,0Z"/>
            <path
              className="cls-5-NextCir"
              style={{
                stroke:this.props.pathStyle.stroke
              }}
              d="M3.5,5.4,51.1,26.52C53,27.38,54,28.13,54,31s-1,3.6-2.9,4.45L3.5,56.54"/>
          </g>
        </g>
      </svg>

    )
  }
}
