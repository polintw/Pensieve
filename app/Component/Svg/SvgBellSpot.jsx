import React from 'react';

export default class SvgBellSpot extends React.Component {
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
        viewBox="0 0 47 47"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}>
        <defs>
          <style>{".cls-1-BellSpot{fill:red;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <circle className="cls-1-BellSpot" cx="23.5" cy="23.5" r="23.5"/>
          </g>
        </g>
      </svg>
    )
  }
}
