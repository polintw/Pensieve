import React from 'react';

export default class SvgCircleSpot extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
    <svg xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 137 132"
      style={{
        width: '109%',
        height: 'auto'
      }}>
      <defs>
        <style>{".cls-1-CircleSpot{opacity:0.65;}.cls-2-CircleSpot{fill:url(#id_svgGradient_Circle_Spot);}.cls-3-CircleSpot{fill:#fff;}.cls-4-CircleSpot{fill:#ff9a5e;}"}</style>
        <radialGradient id="id_svgGradient_Circle_Spot" cx="61" cy="71" r="61.57" gradientUnits="userSpaceOnUse">
          <stop offset="0.72" stopColor="#fff" stopOpacity="0"/>
          <stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/>
          <stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#787759"/>
        </radialGradient>
      </defs>
      <g id="圖層_2" data-name="圖層 2">
        <g id="圖層_1-2" data-name="圖層 1">
          <g className="cls-1-CircleSpot">
            <path className="cls-2-CircleSpot" d="M61,16.5A54.5,54.5,0,1,0,115.5,71,54.5,54.5,0,0,0,61,16.5ZM61,123a52,52,0,1,1,52-52A52,52,0,0,1,61,123Z"/>
          </g>
          <path className="cls-3-CircleSpot" d="M115.5,71A54.5,54.5,0,1,1,78.89,19.52a29.56,29.56,0,0,1,3-5.86A61,61,0,1,0,122,71a61.47,61.47,0,0,0-1.66-14.13,29.57,29.57,0,0,1-6.15,2.26A54.59,54.59,0,0,1,115.5,71Z"/>
          <path className="cls-3-CircleSpot" d="M107,0A30,30,0,0,0,81.85,13.66,29.87,29.87,0,0,0,77,30a30,30,0,0,0,30,30,30.44,30.44,0,0,0,7.19-.87,29.57,29.57,0,0,0,6.15-2.26A30,30,0,0,0,107,0Zm12.55,53.9A26.85,26.85,0,0,1,107,57a27,27,0,1,1,12.55-3.1Z"/>
          <path className="cls-4-CircleSpot" d="M107,3a27,27,0,1,0,6.45,53.22,26.69,26.69,0,0,0,6.1-2.32A27,27,0,0,0,107,3Z"/>
        </g>
      </g>
    </svg>
    )
  }
}
