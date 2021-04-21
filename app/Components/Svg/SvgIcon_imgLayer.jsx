import React from 'react';

export default class SvgImgLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = !!this.props.customStyles ? this.props.customStyles.fillColor: "#a3a3a3" ;

    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 764.73 583.85"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
        })}>
        <defs>

        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1" d="M738.73,583.85H26a26,26,0,0,1-26-26V26A26,26,0,0,1,26,0H738.73a26,26,0,0,1,26,26V557.85A26,26,0,0,1,738.73,583.85ZM36,547.85H728.73V36H36Z"
              fill={fillColor}
              fillRule="nonzero"></path>
            <path className="cls-1" d="M536,490A119.93,119.93,0,1,1,655.9,370,120.06,120.06,0,0,1,536,490Zm0-212.85A92.93,92.93,0,1,0,628.9,370,93,93,0,0,0,536,277.12Z"
              fill={fillColor}
              fillRule="nonzero"></path>
          </g>
        </g>
      </svg>
    )
  }
}
