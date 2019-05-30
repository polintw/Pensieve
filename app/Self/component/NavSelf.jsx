import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {NameRegular} from '../../Component/AccountPlate.jsx';
import SvgAroundLineBlank from '../../Component/Svg/SvgAroundLineBlank.jsx';

const commonStyle={
  boxAccount: {
    display:'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '8px 12% 0% 0',
    float: 'left'
  },
  boxAroundIcon: {
    display: 'inline-block',
    width: '57px',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    paddingBottom: '2px',
    paddingTop: '5px',
    float: 'right',
  },
  boxAroundIconFoot: {
    display: 'inline-block',
    width: '100%',
    height: '78%',
    position: 'relative',
    boxSizing: 'border-box',
    paddingBottom: '1%',
    cursor: 'pointer',
    overflow: 'visible'
  },
  boxAroundIconLine: {
    display: 'inline-block',
    width: '87%',
    height: '20.5%',
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    boxSizing: 'border-box',
  },
}

let pathCognition = true;

class NavSelf extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this.style={
      Com_NavSelf_: {
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_NavSelf_AccountName: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#757575',
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    pathCognition = (props.location.pathname.substring(0,10)=='/cognition') ? true : false;
    return null; //expect a state update, so return null to update nothing.
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    if(pathCognition) window.location.assign('/user/screen');
  }

  render(){
    return(
      <div
        style={this.style.Com_NavSelf_}>
        <div
          style={Object.assign({}, commonStyle.boxAccount)}
          onClick={this._handleClick_selfCover}>
          <div
            style={Object.assign({}, this.style.Com_NavSelf_AccountName, {cursor: pathCognition? "pointer": "default"})}>
            <NameRegular/>
          </div>
        </div>
        {
           pathCognition &&
          <div
            style={commonStyle.boxAroundIcon}>
            <div
              style={commonStyle.boxAroundIconFoot}
              onClick={this._handleClick_selfClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.54 13.9"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}>
                <defs><style>{".cls-1-aroundDual{fill:#4085a0;}.cls-2-aroundDual{fill:#e6e6e6;}"}</style></defs>
                <g id="圖層_2" data-name="圖層 2">
                  <g id="圖層_2-2" data-name="圖層 2">
                    <circle className="cls-1-aroundDual" cx="2.46" cy="11.44" r="2.46"/>
                    <circle className="cls-2-aroundDual" cx="13.25" cy="4.3" r="4.3"/>
                  </g>
                </g>
              </svg>
            </div>
            <div
              style={commonStyle.boxAroundIconLine}>
              <SvgAroundLineBlank
                style={{fill: "#f7f7f7", position: 'absolute'}}/>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavSelf));
