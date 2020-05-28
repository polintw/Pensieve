import React from 'react';

export default class SvgCreateDashed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140"
        style={Object.assign({}, {
          height: '100%',
          width: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}
        preserveAspectRatio="none">
        <defs>
          <style>{".cls-1-CreateDashed{opacity:0.5;}.cls-2-CreateDashed{fill:#fff;}.cls-3-CreateDashed{fill:#333;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <g className="cls-1-CreateDashed">
              <rect className="cls-2-CreateDashed" width="180" height="140"/>
              <path
                className="cls-3-CreateDashed"
                vectorEffect="non-scaling-stroke"
                d="M180,0H170V1h10V0ZM160,0H150V1h10V0ZM140,0H130V1h10V0ZM120,0H110V1h10V0ZM100,0H90V1h10V0ZM80,0H70V1H80V0ZM60,0H50V1H60V0ZM40,0H30V1H40V0ZM20,0H10V1H20V0ZM1,0H0V10H1V0ZM1,20H0V30H1V20ZM1,40H0V50H1V40ZM1,60H0V70H1V60ZM1,80H0V90H1V80Zm0,20H0v10H1V100Zm0,20H0v10H1V120Zm9,19H0v1H10v-1Zm20,0H20v1H30v-1Zm20,0H40v1H50v-1Zm20,0H60v1H70v-1Zm20,0H80v1H90v-1Zm20,0H100v1h10v-1Zm20,0H120v1h10v-1Zm20,0H140v1h10v-1Zm20,0H160v1h10v-1Zm10-9h-1v10h1V130Zm0-20h-1v10h1V110Zm0-20h-1v10h1V90Zm0-20h-1V80h1V70Zm0-20h-1V60h1V50Zm0-20h-1V40h1V30Zm0-20h-1V20h1V10Z"/>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}
