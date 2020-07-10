import React from 'react';

export default class SvgAvetarNoEye extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg viewBox="0 0 35.54 33.57" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <defs>
          <style>{ ".cls-1-Avatar{fill:#fff;}.cls-1-Avatar,.cls-3-Avatar{fill-rule:evenodd;}.cls-2-Avatar{mask:url(#mask);}.cls-3-Avatar{fill:rgba(84, 84, 84, 0.45);} "}</style>
          <mask id="mask" x="0" y="0" width="35.54" height="33.57" maskUnits="userSpaceOnUse">
            <g id="mask-2">
              <polygon id="path-1" className="cls-1-Avatar" points="0 0 35.54 0 35.54 33.57 0 33.57 0 0"/>
            </g>
          </mask>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <g id="Dashboard">
              <g id="homepage_general" data-name="homepage/general">
                <g id="avatar">
                  <g id="Group-10">
                    <g id="Group-3">
                      <g className="cls-2-Avatar">
                        <path id="Fill-1" className="cls-3-Avatar" d="M27.14,17.62V9.17a9.38,9.38,0,0,0-18.75,0v8.45A13.84,13.84,0,0,0,0,30.26a3.34,3.34,0,0,0,3.38,3.31H32.16a3.34,3.34,0,0,0,3.38-3.31,13.84,13.84,0,0,0-8.4-12.64"/>
                      </g>
                    </g>
                    <path id="Fill-8" className="cls-1-Avatar" d="M18.29,15.87a9.05,9.05,0,0,1-5.38-2.12.53.53,0,0,1-.06-.7A.44.44,0,0,1,13.5,13c.19.17,4.75,4.2,9,0a.42.42,0,0,1,.64,0,.53.53,0,0,1,0,.71,6.73,6.73,0,0,1-4.81,2.13"/>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>

    )
  }
}
