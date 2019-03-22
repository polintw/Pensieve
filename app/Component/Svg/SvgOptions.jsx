import React from 'react';

export default class SvgOptions extends React.Component {
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
        viewBox="0 0 3.5 15.34"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}>
        <defs>
          <style>{".cls-1-options{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:0.45px;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_5" data-name="圖層 5">
            <ellipse className="cls-1-options" cx="1.75" cy="13.59" rx="1.47" ry="1.48"/>
            <ellipse className="cls-1-options" cx="1.75" cy="7.67" rx="1.47" ry="1.48"/>
            <ellipse className="cls-1-options" cx="1.75" cy="1.75" rx="1.47" ry="1.48"/>
          </g>
        </g>
      </svg>
    )
  }
}
