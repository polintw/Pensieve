import React from 'react';
import {connect} from "react-redux";
import NotifyBox from './NotifyBox.jsx';
import SvgBell from '../../../../Component/Svg/SvgBell.jsx';
import SvgBellSpot from '../../../../Component/Svg/SvgBellSpot.jsx';
import {
  handleBellNotify,
  setCognitionBellnotify
} from '../../../../redux/actions/cognition.js';

const styleMiddle = {
  boxIcon: {
    width: '7%',
    height: '100%',
    position: "absolute",
    boxSizing: 'border-box',
    right: '6.4%',
    cursor: 'pointer'
  },
  boxBell: {
    width: '100%',
    position: 'absolute',
    top:'50%',
    transform: 'translate(0,-43%)',
    boxSizing: 'border-box',
    overflow: 'visible'
  },
  boxSpot: {
    width: '66%',
    position: 'absolute',
    top: '-15%',
    left: '-33%',
    boxSizing: 'border-box',
    overflow: 'visible'
  },
  fontBellCount: {
    fontFamily: 'myriad-pro-semiextended',
    fontSize: '1.24rem',
    fontWeight: '300',
    letterSpacing: '-1px',
    color: 'white'
  },
  spanCount: {
    display: 'inline-block',
    position: 'absolute',
    top: '-2%',
    left: '42%',
    transform: 'translate(-50%,0)'
  },
  rootNotifyBox: {
    width: '89%', //let the box bottom a bit wider than the distance between bell and most right button
    height: '100%',
    position: 'absolute',
    right: '5%',
    bottom: '0%',
    boxSizing: 'border-box',
  }
};

class NotifyBell extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notifyBox: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_bell = this._handleClick_bell.bind(this);
    this.style={

    }
  }

  _handleClick_bell(event){
    event.stopPropagation();
    event.preventDefault();
    //open Notify box
    this.setState((prevState, props)=> {return {notifyBox: prevState.notifyBox? false : true};});
    //delete notify count : switch bellNotify to default
    this.props._set_BellNotify(0);
  }

  componentDidMount(){
    this.props._get_NotifyCount(this.axiosSource.token);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={'boxRelativeFull'}>
        {
          this.state.notifyBox &&
          <div
            style={styleMiddle.rootNotifyBox}>
            <NotifyBox/>
          </div>
        }
        <div
          style={styleMiddle.boxIcon}
          onClick={this._handleClick_bell}>
          <div style={styleMiddle.boxBell}>
            <SvgBell/>
          </div>
          {
            this.props.cognition.bellNotify &&
            <div style={styleMiddle.boxSpot}>
              <SvgBellSpot/>
              <span
                style={Object.assign({}, styleMiddle.fontBellCount, styleMiddle.spanCount)}>
                {this.props.cognition.bellNotify}</span>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    cognition: state.cognition
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _get_NotifyCount: (cancelToken)=>{dispatch(handleBellNotify(cancelToken));},
    _set_BellNotify: (count)=>{dispatch(setCognitionBellnotify(count));}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyBell);
