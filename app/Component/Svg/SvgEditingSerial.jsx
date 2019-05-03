import React from 'react';

export default class SvgEditingSerial extends React.Component {
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
        viewBox="0 0 109.09 53.91"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}>
        <defs>
          <style>{".cls-1-editingSerial{fill:none;stroke:#fff;stroke-miterlimit:10;}.cls-2-editingSerial{font-size:28px;fill:#fff;font-family:Lato-Regular, Lato;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_3" data-name="圖層 3">
            <path class="cls-1-editingSerial" d="M7,37.5A60.77,60.77,0,0,0,48.07,53.41,61,61,0,0,0,108.59.06M102,.13A54.51,54.51,0,0,1,48.07,46.91a54.48,54.48,0,0,1-47.63-28"/>
            <text class="cls-2-editingSerial" transform="translate(64.82 29.05)">
              {this.props.serial}
            </text>
          </g>
        </g>
      </svg>
    )
  }
}
