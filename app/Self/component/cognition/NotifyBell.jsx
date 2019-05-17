import React from 'react';
import NotifyBox from './NotifyBox.jsx';
import SvgBell from '../../../Component/Svg/SvgBell.jsx';
import SvgBellSpot from '../../../Component/Svg/SvgBellSpot.jsx';
import {handleBellNotify} from '../../../redux/actions/cognition.js';

const generalStyle = { //could included in a global style sheet
  boxRelativeFull: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
};

const styleMiddle = {
  boxBell: {
    width: '6%',
    position: "absolute",
    boxSizing: 'border-box',
    right: '6.4%',
    top:'50%',
    transform: 'translate(0,-39%)',
    cursor: 'pointer'
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
    //open Notify box: swith bellnotify state in redux
    //delete notify count : switch bellNotify to default

  }

  componentDidMount(){
    this.props._get_NotifyCount(this.axiosSource.token);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={generalStyle.boxRelativeFull}>
        <div
          style={styleMiddle.boxBell}
          onClick={this._handleClick_bell}>
          <SvgBell/>
          {
            this.props.cognition.bellNotify &&
            <div>
              <SvgBellSpot/>
              <span>{this.props.cognition.bellNotify}</span>
            </div>
          }
        </div>
        {
          this.state.notifyBox &&
          <NotifyBox/>
        }
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
    _get_NotifyCount: (cancelToken)=>{dispatch(handleBellNotify(cancelToken));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyBell));
