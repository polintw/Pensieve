import React from 'react';
import {connect} from "react-redux";
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  handleNotifyBox
} from '../../../../redux/actions/cognition.js';

const styleMiddle = {
  boxNotifyBox: {
    width: '100%',
    maxHeight: '640%',
    minHeight: '270%',
    position: 'absolute',
    bottom: '102%',
    left: '0',
    boxSizing: 'border-box',
    boxShadow: '0.056rem -0.16rem 0.21rem -0.06rem',
    borderRadius: '0.21rem',
    backgroundColor: 'white',
    overflow: 'auto'
  },
  boxNotifyItem:{
    hight: '64px',
    boxSizing: 'border-box',
    margin: '1% 0',
    borderBottom: '1px solid black',
    cursor: 'pointer'
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
    const self = this;
    return this.props.cognition.listNotify.map((item, index)=>{
      //should check item type here to determine which template should be used
      //but for now we only have the notifications for inspired, so, no need
      //(only 'inspired' template now)
      return (
        <div
          key={'key_Notify_item_'+index}
          className={'boxRelativeFull'}
          style={Object.assign({}, styleMiddle.boxNotifyItem, {backgroundColor: (item.status=="untouched")? '#f1f1f1': 'white'})}>
          <Link
            to={"/cognition/actions/shareds/units/"+item.unitId}
            className={'plainLinkButton'}>
            <div>
              <span>{self.props.usersBasic[item.userId].account}</span>
            </div>
            <span>{" was inspired by one of your paragraph."}</span>
          </Link>
        </div>
      )
    })
  }

  componentDidMount(){
    this.props._get_NotifyList(this.axiosSource.token);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div className={'boxRelativeFull'}>
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
    usersBasic: state.usersBasic,
    unitCurrent: state.unitCurrent,
    cognition: state.cognition
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _get_NotifyList: (cancelToken)=>{dispatch(handleNotifyBox(cancelToken));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyBox));
