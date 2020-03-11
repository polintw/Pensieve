import React from 'react';

export class SvgSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 130.5"
        style={{
          width: '100%',
          height: 'auto',
          overflow:'visible'
        }}>
        <defs>
          <style>{".cls-1-UnitSwitch{fill:#f0f0f0;}.cls-2-UnitSwitch{opacity:0.74;}.cls-3-UnitSwitch{opacity:0.56;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path className="cls-1-UnitSwitch" d="M25.5,87C11.27,87,1,78,.08,65H0V22H.08C1,9,11.27,0,25.5,0S50,9,50.92,22H51V65h-.08C50,78,39.73,87,25.5,87ZM3,63.08v.39C3.23,75.75,12.26,84,25.5,84S47.77,75.75,48,63.47V23.53C47.77,11.25,38.74,3,25.5,3S3.23,11.25,3,23.53V63.08Z"/>
            <circle className="cls-1-UnitSwitch" cx="26" cy="29.5" r="4.5"/>
            <g className="cls-2-UnitSwitch">
              <path className="cls-1-UnitSwitch" d="M26,113.5c-10.89,0-19.66-5.2-23.47-13.9l2.74-1.2C8.59,106,16.34,110.5,26,110.5S43.41,106,46.73,98.4l2.74,1.2C45.66,108.3,36.89,113.5,26,113.5Z"/>
            </g>
            <g className="cls-3-UnitSwitch">
              <path className="cls-1-UnitSwitch" d="M26,130.5c-10.89,0-19.66-5.2-23.47-13.9l2.74-1.2C8.59,123,16.34,127.5,26,127.5S43.41,123,46.73,115.4l2.74,1.2C45.66,125.3,36.89,130.5,26,130.5Z"/>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

export class SvgLayerSpot extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          overflow:'visible'
        }}>
        <defs>
          <style>{".cls-1-SwitSpot{fill:#f0f0f0;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <circle className="cls-1-SwitSpot" cx="4.5" cy="4.5" r="4.5"/>
          </g>
        </g>
      </svg>
    )
  }
}

export class SvgSwitUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.95 32.1"
        style={{
          width: '100%',
          height: 'auto',
          overflow:'visible'
        }}>
        <defs>
          <style>{".cls-1-SwitUp{opacity:0.74;}.cls-2-SwitUp{fill:#f0f0f0;}.cls-3-SwitUp{opacity:0.56;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <g className="cls-1-SwitUp">
              <path className="cls-2-SwitUp" d="M23.47,17C12.59,17,3.81,22.2,0,30.9l2.75,1.2C6.07,24.52,13.81,20,23.47,20S40.88,24.52,44.2,32.1L47,30.9C43.14,22.2,34.36,17,23.47,17Z"/>
            </g>
            <g className="cls-3-SwitUp">
              <path className="cls-2-SwitUp" d="M23.47,0C12.59,0,3.81,5.2,0,13.9l2.75,1.2C6.07,7.52,13.81,3,23.47,3S40.88,7.52,44.2,15.1L47,13.9C43.14,5.2,34.36,0,23.47,0Z"/>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}
