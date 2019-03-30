import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
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
    borderLeft: 'solid 0.16rem #e6e6e6'
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
  spanAccountName: {
    display: 'inline-block',
    position: 'absolute',
    bottom: '2%',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    fontSize: '1.54rem',
    fontWeight: '400',
    letterSpacing: '0.18rem',
    cursor: 'pointer'
  }
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
        color: '#757575',
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
    return(
      <div
        style={this.style.Com_NavSelf_}>
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
          style={commonStyle.boxAccount}
          onClick={this._handleClick_selfCover}>
          <span style={Object.assign({}, commonStyle.spanAccountName, this.style.Com_NavSelf_AccountName)}>
            {this.props.userInfo.firstName + " " + this.props.userInfo.lastName}
          </span>
        </div>
        <div
          style={commonStyle.boxAroundIconLine}>
          <SvgAroundLineBlank
            style={{fill: "#e6e6e6", position: 'absolute'}}/>
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
