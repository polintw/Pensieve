import React from 'react';
import cxBind from 'classnames/bind';

export default class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_cosmic_Ltd = this._handleClick_cosmic_Ltd.bind(this);
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={
      withinCom_CosmicCorner_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_CosmicCorner_Ltd: {
        width: '40%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '5%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.3rem',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_: {
        width: '24%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '48%',
        boxSizing: 'border-box',
      },
      withinCom_CosmicCorner_Self_svg: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_cosmic_Ltd(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Pages("ltd");
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/self');
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicCorner_}>
        <div
          style={this.style.withinCom_CosmicCorner_Ltd}
          onClick={this._handleClick_cosmic_Ltd}>
          {"CORNER"}
        </div>
        <div
          style={this.style.withinCom_CosmicCorner_Self_}
          onClick={this._handleClick_cosmic_Self}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 182"
            style={this.style.withinCom_CosmicCorner_Self_svg}>
            <defs><style>{".cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <path d="M91,2A89,89,0,1,1,2,91,89.11,89.11,0,0,1,91,2m0-2a91,91,0,1,0,91,91A91,91,0,0,0,91,0Z"/>
                <path className="cls-1" d="M113.14,109.53c15.47,5.49,40,14.62,47.36,20l2,6a58.09,58.09,0,0,1,1,10"/>
                <path className="cls-1" d="M16.5,142.5s0-8,2-12c.08-.16,1.89-3.86,2-4,2.05-2.73,30.84-11.74,49-17.19"/>
                <path d="M91.5,25A44.51,44.51,0,1,1,47,69.5,44.55,44.55,0,0,1,91.5,25m0-1A45.5,45.5,0,1,0,137,69.5,45.5,45.5,0,0,0,91.5,24Z"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
  }
}
