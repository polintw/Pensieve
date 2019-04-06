import React from 'react';

export default class SvgButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"
      viewBox="0 0 122 122"
      style={{
        maxWidth: '100%',
        maxHeight: '100%'
      }}>
      <defs><style>{".cls-1-Button{fill:#ff7a5f;}.cls-2-button{fill:none;stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:3px;}"}</style></defs>
      <g id="圖層_2" data-name="圖層 2">
        <g id="圖層_5" data-name="圖層 5">
          <circle className="cls-1-Button" cx="22" cy="22" r="22"/>
          <line className="cls-2-button" x1="10.79" y1="21.66" x2="33.21" y2="21.66"/>
          <line className="cls-2-button" x1="22" y1="33.21" x2="22" y2="10.79"/>
        </g>
      </g>
    </svg>
    )
  }
}
