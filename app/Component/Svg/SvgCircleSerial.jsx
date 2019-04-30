import React from 'react';

export default class SvgCircleSerial extends React.Component {
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
        viewBox="0 0 122 122"
        style={{
          width: '100%',
          height: 'auto'
        }}>
        <defs>
          <style>{".cls-1-CircleSerial,.cls-4-CircleSerial{fill:#fff;}.cls-2-CircleSerial{opacity:0.65;}.cls-3-CircleSerial{fill:url(#未命名漸層_26);}.cls-4-CircleSerial{font-size:39px;font-family:Lato-Regular, Lato;text-shadow: 1.6px 1px 1px #787759;}"}</style>
          <radialGradient id="id_svgGradient_CircleSerial" cx="61" cy="61" r="61.57" gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#fff" stopOpacity="0"/><stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/><stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/><stop offset="1" stopColor="#787759"/>
          </radialGradient>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path className="cls-1-CircleSerial" d="M61,0a61,61,0,1,0,61,61A61,61,0,0,0,61,0Zm0,115.5A54.5,54.5,0,1,1,115.5,61,54.5,54.5,0,0,1,61,115.5Z"/>
            <g className="cls-2-CircleSerial">
              <path className="cls-3-CircleSerial" d="M61,6.5A54.5,54.5,0,1,0,115.5,61,54.5,54.5,0,0,0,61,6.5ZM61,113a52,52,0,1,1,52-52A52,52,0,0,1,61,113Z"/>
            </g>
            <text className="cls-4-CircleSerial" transform="translate(77.75 97.64)">
              {this.props.serial}
            </text>
          </g>
        </g>
      </svg>
    )
  }
}
