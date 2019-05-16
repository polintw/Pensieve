import React from 'react';

export default class SvgBell extends React.Component {
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
        viewBox="0 0 103.69 110.32"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}>
        <defs>
          <style>{".cls-1-bell,.cls-2-bell,.cls-3-bell,.cls-4-bell{fill:none;stroke:#757575;}.cls-1-bell,.cls-2-bell{stroke-linejoin:round;}.cls-1-bell{stroke-width:4px;}.cls-2-bell,.cls-3-bell{stroke-linecap:round;}.cls-2-bell{stroke-width:7px;}.cls-3-bell,.cls-4-bell{stroke-miterlimit:10;stroke-width:6px;}.cls-5-bell{fill:#636363;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path className="cls-1-bell" d="M90.88,10.11l-.1-.08.2.14-.1-.06a33.11,33.11,0,0,1,5.25,4.5L97.26,13a7,7,0,1,0-11.55-7.9l-1.17,1.7A32.88,32.88,0,0,1,90.88,10.11Z"/>
            <path className="cls-2-bell" d="M41.46,80.7l38.16,26.12c2.83-4.12,2.46-6.8,1.53-8.65a16.73,16.73,0,0,1-2.23-6.37c-.55-4,2.29-13,7.94-21.23,7.34-10.73,11.29-16.5,12.82-25.15,2.37-13.48-3.75-24.38-13-30.74l.2.14c-9.28-6.35-21.66-8.11-33.36-1C46,18.35,42,24.13,34.68,34.85,29,43.11,21.7,49,17.76,49.93a16.69,16.69,0,0,1-6.75.23C9,50,6.32,50.59,3.5,54.71L41.67,80.84"/>
            <path className="cls-3-bell" d="M32.93,37.66c4,6,15.57,15.91,23,21a87.25,87.25,0,0,0,19,10"/>
            <path className="cls-4-bell" d="M25.93,44.66c3,5,19.35,18.06,25.13,22,4.86,3.32,17.87,11,25.87,14"/>
            <path className="cls-5-bell" d="M45,91.09a11.06,11.06,0,0,0,17.83,12.2Z"/>
          </g>
        </g>
      </svg>
    )
  }
}
