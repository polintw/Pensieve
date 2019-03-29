import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

export default class TitleInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Title_Inspired_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Title_Inspired_main_: {
        display: 'inline-block',
        position: 'absolute',
        top: '42.5%',
        left: '5%',
        boxSizing: 'border-box',
        margin: '0 3%',
        fontWeight: '700',
        fontSize: '2.8rem',
        letterSpacing: '0.54rem'
      },
      selfCon_Title_Inspired_bulb_:{
        display: 'inline-block',
        width: '15%',
        position: 'absolute',
        top: '-19%',
        right: '-5.6%',
        boxSizing: 'border-box',
      },
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Title_Inspired_}>
        <div
          style={this.style.selfCom_Title_Inspired_main_}>
          <div
            style={this.style.selfCon_Title_Inspired_bulb_}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 123.01 202.15"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'visible'
              }}>
              <defs><style>{".cls-1-bulbInspired{fill:none;stroke:#e3e3e3;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.64rem;}"}</style></defs>
              <g id="圖層_2" data-name="圖層 2">
                <g id="圖層_1-2" data-name="圖層 1">
                  <path className="cls-1-bulbInspired" d="M34.84,151.09c16.16-4.17,32.29-8.48,48.52-12.38,3.21-.77,5.06-2.26,5.41-5.13,1.38-11.19,6.7-20.2,14.55-28,7.68-7.64,13.82-16.39,16.45-27,6.18-24.95-.44-46.22-19.46-63.46-21-19-56.54-18.41-77-.59C8.7,27.2,1,43.05,1,62.09c0,16.25,5.65,30.8,17.37,42.47,9.79,9.76,15.29,21.53,17.47,35"/>
                  <path className="cls-1-bulbInspired" d="M91.34,155.59c-11,1.57-21.64,5.14-32.51,7.46-8.53,1.82-16.71,5.13-25.49,5.79"/>
                  <path className="cls-1-bulbInspired" d="M87.59,172.59c1.29,2.67-1.42,2.19-2.28,2.41-14.8,3.79-29.64,7.41-44.47,11.1-2.16.53-4.16,1.77-6.5,1.49"/>
                  <path className="cls-1-bulbInspired" d="M60.59,91.09c-2.33-.58-3.48-2.73-5.29-4-2.87-2-6-3.29-9.06,0,1.74,9.31,5.85,18.17,6.13,27.9.15,5,1.7,10,.47,15"/>
                  <path className="cls-1-bulbInspired" d="M73.84,87.59c1.21,5-1.44,9.4-2.6,14a104.11,104.11,0,0,0-3.4,28.53"/>
                  <path className="cls-1-bulbInspired" d="M45.34,194.84c7,5.51,14.6,8.23,23.51,4.78a18.36,18.36,0,0,0,8-5.53"/>
                  <path className="cls-1-bulbInspired" d="M59.84,94.09c1.46-4.07,7.12-7.58,12-7.52,1.07,0,2.44.68,3-1"/>
                </g>
              </g>
            </svg>
          </div>
          <span style={{position: 'relative'}}>{"Inspired"}</span>
        </div>
      </div>
    )
  }
}
