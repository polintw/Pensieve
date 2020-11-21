import React from 'react';

export default class SvgFilterNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295.11 158.78"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
        })}>
        <defs>
          <style>{".cls-1-filterNode" + (!!this.props.customstyle ? this.props.customstyle : "{fill:#757575;}") }</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1-filterNode" d="M54.53,0C24.46,0,0,23.73,0,52.87A51.87,51.87,0,0,0,6.54,78l45,78.91a3.44,3.44,0,0,0,6,0l45-78.94a51.67,51.67,0,0,0,6.54-25.11C109.06,23.73,84.6,0,54.53,0Zm0,79.31c-15,0-27.27-11.85-27.27-26.44S39.5,26.44,54.53,26.44,81.79,38.3,81.79,52.87,69.56,79.31,54.53,79.31Z"/>
            <path className="cls-1-filterNode" d="M288.44,158.78H134.27a6,6,0,1,1,0-12H288.44a6,6,0,1,1,0,12Z"/>
            <path className="cls-1-filterNode" d="M289.11,26.78h-135a6,6,0,1,1,0-12h135a6,6,0,0,1,0,12Z"/>
            <path className="cls-1-filterNode" d="M288.61,92.78h-135a6,6,0,0,1,0-12h135a6,6,0,0,1,0,12Z"/>
          </g>
        </g>
      </svg>

    )
  }
}
