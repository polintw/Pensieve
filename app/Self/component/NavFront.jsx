import React from 'react';
import cxBind from 'classnames/bind';

export default class NavFront extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false
    };
    this.style={
      selfCom_NavFront_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavFront_buttons_: {
        display: 'inline-block',
        width: '24%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        fontSize: '1.3rem',
        fontWeight: '400',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavFront_}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 13"
          style={{height: "100%", cursor: "pointer"}}>
          <defs><style>{".cls-1{fill:#9e9e9e;stroke:none;}"}</style></defs>
          <g id="圖層_2" data-name="圖層 2">
            <g id="圖層_17" data-name="圖層 17">
              <circle className="cls-1" cx="2" cy="2" r="2"/>
              <circle className="cls-1" cx="2" cy="11" r="2"/>
            </g>
          </g>
        </svg>
        {
          this.state.expandify &&
          <div
            style={this.style.selfCom_NavFront_buttons_}>
            <span>{'靜態'}</span>
            <span>{'未來'}</span>
          </div>
        }
      </div>
    )
  }
}
