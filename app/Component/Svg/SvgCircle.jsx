import React from 'react';

class CircleSerial extends React.Component {
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

class CircleSpot extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"
        style={{
          width: '49%',
          height: 'auto',
          position: 'absolute',
          top: '0',
          right: '0'
        }}>
        <defs>
          <style>{".cls-1-CircleSpot{fill:#fff;}.cls-2-CircleSpot{fill:#ff9a5e;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path className="cls-1-CircleSpot" d="M30,0A30,30,0,0,0,4.85,13.66,29.87,29.87,0,0,0,0,30,30,30,0,0,0,30,60a30.44,30.44,0,0,0,7.19-.87,29.57,29.57,0,0,0,6.15-2.26A30,30,0,0,0,30,0ZM42.55,53.9A26.85,26.85,0,0,1,30,57a27,27,0,1,1,12.55-3.1Z"/>
            <path className="cls-2-CircleSpot" d="M30,3a27,27,0,1,0,6.45,53.22,26.69,26.69,0,0,0,6.1-2.32A27,27,0,0,0,30,3Z"/>
          </g>
        </g>
      </svg>
    )
  }
}

class CircleCurrent extends React.Component {
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
        viewBox="0 0 126 126"
        style={{
          width: '100%',
          height: 'auto'
        }}>
        <defs>
          <style>{".cls-1-CircleCurrent{opacity:0.65;}.cls-2-CircleCurrent{fill:url(#未命名漸層_26);}.cls-3-CircleCurrent{fill:#ffb25f;}"}</style>
          <radialGradient id="未命名漸層_26" cx="63" cy="63" r="71.17" gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#fff" stopOpacity="0"/><stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/>
            <stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/><stop offset="1" stopColor="#787759"/>
          </radialGradient>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <g className="cls-1-CircleCurrent">
              <path className="cls-2-CircleCurrent" d="M63,0a63,63,0,1,0,63,63A63,63,0,0,0,63,0Zm0,123.11A60.11,60.11,0,1,1,123.11,63,60.11,60.11,0,0,1,63,123.11Z"/>
            </g>
            <g className="cls-1-CircleCurrent">
              <path d="M63,13a50,50,0,1,0,50,50A50,50,0,0,0,63,13Zm0,97.71A47.71,47.71,0,1,1,110.71,63,47.71,47.71,0,0,1,63,110.71Z"/>
            </g>
            <path className="cls-3-CircleCurrent" d="M63,2a61,61,0,1,0,61,61A61,61,0,0,0,63,2Zm0,111a50,50,0,1,1,50-50A50,50,0,0,1,63,113Z"/>
          </g>
        </g>
      </svg>
    )
  }
}

class Circle extends React.Component {
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
          <style>{".cls-1-Circle{fill:#fff;}.cls-2-Circle{opacity:0.65;}.cls-3-Circle{fill:url(#id_svgGradient_Circle);}"}</style>
          <radialGradient id="id_svgGradient_Circle" cx="61" cy="61" r="61.57" gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#fff" stopOpacity="0"/>
            <stop offset="0.79" stopColor="#d9d9d0" stopOpacity="0.28"/>
            <stop offset="0.93" stopColor="#93927b" stopOpacity="0.8"/>
            <stop offset="1" stopColor="#787759"/>
          </radialGradient>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1-Circle" d="M61,0a61,61,0,1,0,61,61A61,61,0,0,0,61,0Zm0,115.5A54.5,54.5,0,1,1,115.5,61,54.5,54.5,0,0,1,61,115.5Z"/>
            <g className="cls-2-Circle">
              <path className="cls-3-Circle" d="M61,6.5A54.5,54.5,0,1,0,115.5,61,54.5,54.5,0,0,0,61,6.5ZM61,113a52,52,0,1,1,52-52A52,52,0,0,1,61,113Z"/>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

export default class SvgCircle extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Circle = this._render_Circle.bind(this);
    this.style={

    }
  }

  _render_Circle(){
    if(this.props.serial) return (<CircleSerial serial={this.props.serial}/>)
    else{
      return this.props.current ? (<CircleCurrent/>) : (<Circle/>)
    }
  }

  render(){
    return(
      <div
        style={{
          width: '100%',
          height: '100%'
        }}>
        {this._render_Circle()}
        {
          this.props.notify &&
          <CircleSpot/>
        }
      </div>
    )
  }
}
