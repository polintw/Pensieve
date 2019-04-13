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
    width: '70%',
    height: '42%',
    position: 'absolute',
    top: '27%',
    left: '27%',
    boxSizing: 'border-box',
    paddingLeft: '4%',
  },
  boxAroundIcon: {
    display: 'inline-block',
    width: '20%',
    height: '78%',
    position: 'absolute',
    left: '5%',
    boxSizing: 'border-box',
    padding: '2.4% 0 1%',
    cursor: 'pointer'
  },
  boxAroundIconLine: {
    display: 'inline-block',
    width: '46%',
    height: '21%',
    position: 'absolute',
    bottom: '1%',
    left: '9%',
    boxSizing: 'border-box',
  },
}

class NavSelf extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this.style={
      Com_NavSelf_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_NavSelf_AccountName: {
        display: 'inline-block',
        position: 'absolute',
        bottom: '2%',
        boxSizing: 'border-box',
        color: '#757575',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/user/screen');
  }

  render(){
    //let cx = cxBind.bind(styles);
    let pathCognition = this.props.location.pathname.substring(0,10)=='/cognition'? true : false;

    return(
      <div
        style={this.style.Com_NavSelf_}>
        {
           pathCognition &&
          <div>
            <div
              style={commonStyle.boxAroundIcon}
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
                style={{fill: "#e6e6e6", position: 'absolute'}}/>
            </div>
          </div>
        }
        <div
          style={Object.assign({}, commonStyle.boxAccount,{borderLeft: pathCognition? 'solid 0.16rem #e6e6e6' : ''})}
          onClick={this._handleClick_selfCover}>
          <div
            style={this.style.Com_NavSelf_AccountName}>
            <NameRegular/>
          </div>
        </div>
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
