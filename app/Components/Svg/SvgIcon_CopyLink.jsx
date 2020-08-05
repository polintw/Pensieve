import React from 'react';

export default class SvgCopyLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = this.props.mouseReact ? "#545454": "#a3a3a3";
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.85 172.73"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <defs><style>{".cls-1-copyLink{fill:"+fillColor+";}"}</style></defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path className="cls-1-copyLink" d="M120.35,0H33.85a10.51,10.51,0,0,0-10.5,10.5V136.93a10.51,10.51,0,0,0,10.5,10.5h86.5a10.51,10.51,0,0,0,10.5-10.5V10.5A10.51,10.51,0,0,0,120.35,0ZM40.85,136.43a6.51,6.51,0,0,1-6.5-6.5V17.5a6.51,6.51,0,0,1,6.5-6.5h72.5a6.51,6.51,0,0,1,6.5,6.5V129.93a6.51,6.51,0,0,1-6.5,6.5Z"/>
            <path className="cls-1-copyLink" d="M96.5,152v3.27a6.51,6.51,0,0,1-6.5,6.5H17.5a6.51,6.51,0,0,1-6.5-6.5V42.8a6.51,6.51,0,0,1,6.5-6.5h1v-11h-8A10.51,10.51,0,0,0,0,35.8V162.23a10.51,10.51,0,0,0,10.5,10.5H97a10.51,10.51,0,0,0,10.5-10.5V152Z"/>
            <circle className="cls-1-copyLink" cx="55.44" cy="60.99" r="5.28"/>
            <circle className="cls-1-copyLink" cx="55.44" cy="83.69" r="5.28"/>
            <polygon className="cls-1-copyLink" points="73.44 98.11 65.42 98.11 81.57 50.77 89.59 50.77 73.44 98.11"/>
            <polygon className="cls-1-copyLink" points="91.18 98.11 83.16 98.11 99.31 50.77 107.33 50.77 91.18 98.11"/>
          </g>
        </g>
      </svg>
    )

  }
}
