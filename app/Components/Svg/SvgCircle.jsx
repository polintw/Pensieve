import React from 'react';

class CircleSerial extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterCircle: false
    };
    this._handleEnterSVG_CircleSerial = this._handleEnterSVG_CircleSerial.bind(this);
    this._handleLeaveSVG_CircleSerial = this._handleLeaveSVG_CircleSerial.bind(this);
  }

  _handleEnterSVG_CircleSerial(e){
    this.setState({
      onEnterCircle: true
    })
  }

  _handleLeaveSVG_CircleSerial(e){
    this.setState({
      onEnterCircle: false
    })
  }

  render(){
    let styleString = ".cls-1-CircleSerial,.cls-4-CircleSerial{fill:#fff;}.cls-4-CircleSerial{font-size:32px;font-weight: bold;}.cls-5-CircleSerial{stroke: #fff;stroke-width: 3;}";

    return(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 122 122"
        style={{
          width: '100%',
          height: 'auto',
          overflow: 'visible'
        }}
        onMouseEnter={this._handleEnterSVG_CircleSerial}
        onMouseLeave={this._handleLeaveSVG_CircleSerial}>
        <defs>
          <style>
            {styleString}
          </style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <circle
              className="cls-5-CircleSerial"
              style={{ fill: this.props.current? (!!this.props.serial ? "rgba(240, 151, 22, 0.45)" : "transparent") : (this.state.onEnterCircle ? "rgba(255, 129, 104, 0.45)": " rgba(84, 84, 84, 0.45)") }}
              cx="61" cy="61" r="61" />
            <path className="cls-1-CircleSerial" d="M61,0a61,61,0,1,0,61,61A61,61,0,0,0,61,0Zm0,115.5A54.5,54.5,0,1,1,115.5,61,54.5,54.5,0,0,1,61,115.5Z"/>
            <text className="cls-4-CircleSerial" transform="translate(53 73)">
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
    return (
      <CircleSerial
        serial={this.props.serial}
        current={this.props.current}/>)

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
