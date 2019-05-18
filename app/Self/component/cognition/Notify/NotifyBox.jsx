import React from 'react';
import {connect} from "react-redux";
import {
  handleNotifyBox
} from '../../../../redux/actions/cognition.js';

const styleMiddle = {
  boxNotifyBox: {
    width: '100%',
    maxHeight: '600%',
    minHeight: '180%',
    position: 'absolute',
    bottom: '100%',
    left: '0',
    boxSizing: 'border-box',
    boxShadow: '0.1rem -0.1rem 0.1rem -0.07rem',
    overflow: 'auto'
  }
};

class NotifyBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._render_NotifyList = this._render_NotifyList.bind(this);
    this.style={

    }
  }

  _render_NotifyList(){
    this.props.cognition.

  }

  componentDidMount(){
    this.props._get_NotifyList(this.axiosSource.token);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div className={'boxRelativeFull'}>
        //surely with the items displaying notifications previews
        //(only 'inspired' template now)
        //limit amount each time, and have 'status'
        //
        <div
          style={styleMiddle.boxNotifyBox}>
          {this._render_NotifyList()}
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
    _get_NotifyList: (cancelToken)=>{dispatch(handleNotifyBox(cancelToken));}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyBox);
