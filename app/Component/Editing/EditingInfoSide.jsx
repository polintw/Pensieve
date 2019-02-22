import React from 'react';
import {connect} from "react-redux";
import NounsEditor from './NounsEditor.jsx';
import {UserPlate} from '../AccountPlate.jsx';

class EditingInfoSide extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_getDay = this._render_getDay.bind(this);
    this.style={
      Com_EInfoSide_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_EInfoSide_NounsEditor_: {
        width: '85%',
        height: '52%',
        position: 'absolute',
        top: '10%',
        left: '5%'
      },
      Com_EInfoSide_Date_: {
        width: '70%',
        height: '6%',
        position: 'absolute',
        bottom: '7%',
        left: '5%'
      },
      Com_EInfoSide_AccountPlate_: {
        width: '85%',
        height: '8%',
        position: 'absolute',
        bottom: '1%',
        left: '5%'
      },
      Com_Modal_Editing_ControlSide_Desitny: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        top: '72%',
        left: '0'
      },
      Com_Modal_Editing_ControlSide_Desitny_submit_: {
        width: '42%',
        height: '88%',
        position: 'absolute',
        top: '50%',
        left: '2%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        cursor: 'pointer'
      },
      Com_Modal_Editing_ControlSide_Desitny_cancell_: {
        width: '42%',
        height: '88%',
        position: 'absolute',
        top: '50%',
        left: '52%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        cursor: 'pointer'
      },
      Com_Modal_Editing_ControlSide_Desitny_div_span: {
        display: 'block',
        width: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '3.2vh',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        color: '#FAFAFA'
      }
    }
  }

  _render_getDay(dateObj){
    switch (dateObj.getDay()) {
      case 0:
        return "Sunday, "
        break;
      case 1:
        return "Monday, "
        break;
      case 2:
        return "Tuesday, "
        break;
      case 3:
        return "Wednesday, "
        break;
      case 4:
        return "Thursday, "
        break;
      case 5:
        return "Friday, "
        break;
      case 6:
        return "Saturday, "
        break;
      default:
        return "Sunday"
    }
  }

  render(){
    let editDate = new Date();
    return(
      <div
        style={this.style.Com_EInfoSide_}>
        <div
          style={this.style.Com_EInfoSide_NounsEditor_}>
          <NounsEditor
            nouns={this.props.nouns}
            _set_nouns={this.props._set_nouns}/>
        </div>
        <div
          style={this.style.Com_Modal_Editing_ControlSide_Desitny}>
          <div
            style={this.style.Com_Modal_Editing_ControlSide_Desitny_submit_}
            onClick={this.props._handleClick_Editing_Submit}>
            <span style={this.style.Com_Modal_Editing_ControlSide_Desitny_div_span}>
              {"Submit"}
            </span>
          </div>
          <div
            style={this.style.Com_Modal_Editing_ControlSide_Desitny_cancell_}
            onClick={this.props._handleClick_Editing_Cancell}>
            <span style={this.style.Com_Modal_Editing_ControlSide_Desitny_div_span}>
              {"Cancel"}
            </span>
          </div>
        </div>
        <div
          style={this.style.Com_EInfoSide_Date_}>
          <span>{this._render_getDay(editDate)}</span>
          <span>{editDate.getDate()}</span>
          <span>{' .'}</span>
          <span>{editDate.getMonth()+1}</span>
        </div>
        <div
          style={this.style.Com_EInfoSide_AccountPlate_}>
          <UserPlate
            userInfo={this.props.userInfo}
            _handleClick_Account={this.props._refer_toandclose}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(EditingInfoSide);
