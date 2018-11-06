import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';

export default class NavFront extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false
    };
    this._handleClick_NavFront = this._handleClick_NavFront.bind(this);
    this.style={
      selfCom_NavFront_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavFront_box_: {
        width: '16vh',
        height: '100%',
        position: 'absolute',
        top: '10%',
        left: '24%',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      selfCom_NavFront_box_div_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'boder-box',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        color: '#222222'
      }
    }
  }

  _handleClick_NavFront(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{
      return {expandify: prevState.expandify?false: true}
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        id="selfCom_NavFront_"
        style={this.style.selfCom_NavFront_}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 13"
          style={{height: "100%", cursor: "pointer"}}
          onClick={this._handleClick_NavFront}>
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
            style={this.style.selfCom_NavFront_box_}>
            <div
              style={this.style.selfCom_NavFront_box_div_}>
              <Link
                to={{
                  pathname: "/profile",
                  state: {from: this.props.location}
                }}>
                <span
                  style={{cursor: 'pointer'}}>{'靜態'}</span>
              </Link>
              <span
                style={{cursor: 'pointer'}}>{'接觸'}</span>
              <span
                style={{cursor: 'pointer'}}>{'收件'}</span>
            </div>
          </div>
        }
      </div>
    )
  }
}
