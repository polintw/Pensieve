import React from 'react';
import { connect } from "react-redux";
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";
import {switchUnitAxiosInspire} from "../../../redux/actions/handleUnit.js";

const styleMiddle = {

}

class ViewerBulb extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_inspire_plain = this._axios_inspire_plain.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
    this.style = {
      Com_ViewerBlock_panel_interaction_bulb:{
        width: '17px',
        margin: '0 4%',
        cursor: 'pointer',
        strokeWidth:'10px',
        stroke: '#f7f4bc'
      }
    };
  }

  _handleClick_Inspired(event){
    event.preventDefault();
    event.stopPropagation();
    let aim = this.props.unitCurrent.marksInteraction[this.props.markKey]['inspired'] ? 'delete': 'post';

    this.props._switch_unitAxiosInspire(this._axios_inspire_plain(aim));
  }

  _axios_inspire_plain(aim){
    const self = this;
    let bulbMessage;

    axios({
      method: aim,
      url: '/router/inspire?unitId='+self.props.unitCurrent.unitId+'&markId='+self.props.markKey,
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']}
    }).then(function (res) {
      self.props._switch_unitAxiosInspire();
      if(res.status = 200){
        self.props._set_inpiredMark(self.props.markKey, aim);
        bulbMessage = (aim=="post")?(self.props.userInfo.firstName + "   is happy to know ! "):("You have withdrawn the light.")
      }else{
        console.log("Failed: "+ res.data.err);
        bulbMessage = "Failed, please try again later";
      }
      self.props._set_BlockMessage(bulbMessage);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.props._switch_unitAxiosInspire();
        bulbMessage = "Failed, please try again later";
        self.props._set_BlockMessage(bulbMessage);
      }
    });
  }

  componentWillUnmount(){
    if(this.props.unitAxiosInspire){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={Object.assign({}, this.style.Com_ViewerBlock_panel_interaction_bulb,
            {fill: this.props.unitCurrent.marksInteraction[this.props.markKey]['inspired'] ? '#ff7a5f':'transparent'})}
        onClick={this._handleClick_Inspired}>
        <SvgBulbPlainHalf/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting,
    unitAxiosInspire: state.unitAxiosInspire
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_inpiredMark: (markId, aim)=>{dispatch(setUnitInspired(markId, aim));},
    _switch_unitAxiosInspire: (callBack)=>{dispatch(switchUnitAxiosInspire()).then(()=>{if(callBack) callBack();});},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewerBulb);
