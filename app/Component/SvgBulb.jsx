import React from 'react';

export default class SvgBulb extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <div
        style={{
          width: '100%',
          height: '100%'
        }}>
        {
          this.props.light? <LightedBulb/> : <DarkBulb/>
        }
      </div>
    )
  }
}

class DarkBulb extends React.Component {
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
        viewBox="0 0 123.01 202.15"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          cursor: 'pointer'
        }}>
        <defs><style>{".cls-1{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}"}</style></defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1" d="M34.84,151.09c16.16-4.17,32.29-8.48,48.52-12.38,3.21-.77,5.06-2.26,5.41-5.13,1.38-11.19,6.7-20.2,14.55-28,7.68-7.64,13.82-16.39,16.45-27,6.18-24.95-.44-46.22-19.46-63.46-21-19-56.54-18.41-77-.59C8.7,27.2,1,43.05,1,62.09c0,16.25,5.65,30.8,17.37,42.47,9.79,9.76,15.29,21.53,17.47,35"/>
            <path className="cls-1" d="M91.34,155.59c-11,1.57-21.64,5.14-32.51,7.46-8.53,1.82-16.71,5.13-25.49,5.79"/>
            <path className="cls-1" d="M87.59,172.59c1.29,2.67-1.42,2.19-2.28,2.41-14.8,3.79-29.64,7.41-44.47,11.1-2.16.53-4.16,1.77-6.5,1.49"/>
            <path className="cls-1" d="M60.59,91.09c-2.33-.58-3.48-2.73-5.29-4-2.87-2-6-3.29-9.06,0,1.74,9.31,5.85,18.17,6.13,27.9.15,5,1.7,10,.47,15"/>
            <path className="cls-1" d="M73.84,87.59c1.21,5-1.44,9.4-2.6,14a104.11,104.11,0,0,0-3.4,28.53"/>
            <path className="cls-1" d="M45.34,194.84c7,5.51,14.6,8.23,23.51,4.78a18.36,18.36,0,0,0,8-5.53"/>
            <path className="cls-1" d="M59.84,94.09c1.46-4.07,7.12-7.58,12-7.52,1.07,0,2.44.68,3-1"/>
          </g>
        </g>
      </svg>
    )
  }
}

class LightedBulb extends React.Component {
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
        viewBox="0 0 123.01 202.15"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          cursor: 'pointer'
        }}>
        <defs>
          <style>{".cls-1,.cls-2{stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.cls-1{fill:url(#未命名漸層_45);}.cls-2{fill:none;}"}</style>
          <linearGradient id="未命名漸層_45" x1="61.51" y1="151.46" x2="61.51" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffd16d"/>
            <stop offset="0.1" stopColor="#ffd86f"/>
            <stop offset="0.26" stopColor="#ffed75"/>
            <stop offset="0.37" stopColor="#ffff7b"/>
            <stop offset="0.45" stopColor="#ff8"/>
            <stop offset="0.67" stopColor="#ffffa7"/>
            <stop offset="0.87" stopColor="#ffffba"/>
            <stop offset="1" stopColor="#ffffc1"/>
          </linearGradient>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1" d="M35.84,139.59c0-.4,0-.2-.1-.59C33.5,125.75,28,114.17,18.37,104.56,6.65,92.89,1,78.34,1,62.09c0-19,7.7-34.89,22.28-47.57,20.49-17.82,56-18.43,77,.59,19,17.24,25.64,38.51,19.46,63.46-2.63,10.61-8.77,19.36-16.45,27-7.85,7.81-13.17,16.82-14.55,28-.35,2.87-2.2,4.36-5.41,5.13-16.23,3.9-32.36,8.21-48.56,12.75a46.55,46.55,0,0,0,1.37-5.37A37.38,37.38,0,0,0,35.84,139.59Z"/>
            <path className="cls-2" d="M91.34,155.59c-11,1.57-21.64,5.14-32.51,7.46-8.53,1.82-16.71,5.13-25.49,5.79"/>
            <path className="cls-2" d="M87.59,172.59c1.29,2.67-1.42,2.19-2.28,2.41-14.8,3.79-29.64,7.41-44.47,11.1-2.16.53-4.16,1.77-6.5,1.49"/>
            <path className="cls-2" d="M60.59,91.09c-2.33-.58-3.48-2.73-5.29-4-2.87-2-6-3.29-9.06,0,1.74,9.31,5.85,18.17,6.13,27.9.15,5,1.7,10,.47,15"/>
            <path className="cls-2" d="M73.84,87.59c1.21,5-1.44,9.4-2.6,14a104.11,104.11,0,0,0-3.4,28.53"/>
            <path className="cls-2" d="M45.34,194.84c7,5.51,14.6,8.23,23.51,4.78a18.36,18.36,0,0,0,8-5.53"/>
            <path className="cls-2" d="M59.84,94.09c1.46-4.07,7.12-7.58,12-7.52,1.07,0,2.44.68,3-1"/>
          </g>
        </g>
      </svg>
    )
  }
}
