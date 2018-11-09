import React from 'React';
import {connect} from "react-redux";
import InfoNoun from './InfoNoun.jsx';

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
      Com_EInfoSide_InfoNoun_: {
        width: '85%',
        height: '52%',
        position: 'absolute',
        top: '10%',
        left: '5%'
      },
      Com_EInfoSide_InfoBasic_: {
        width: '85%',
        height: '22%',
        position: 'absolute',
        top: '63%',
        left: '5%'
      },
      Com_EInfoSide_InfoBasic_Name_: {
        width: '100%',
        height: '42%',
        position: 'absolute',
        bottom: '0',
        left: '0'
      },
      Com_EInfoSide_Date_: {
        width: '70%',
        height: '12%',
        position: 'absolute',
        bottom: '0',
        left: '5%'
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
          style={this.style.Com_EInfoSide_InfoNoun_}>
          <InfoNoun
            nounsArr={this.props.nounsArr}
            _set_nounsArr={this.props._set_nounsArr}/>
        </div>
        <div
          style={this.style.Com_EInfoSide_InfoBasic_}>
          <div
            style={this.style.Com_EInfoSide_InfoBasic_Name_}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 182"
              style={{display: 'inline-block', width: '24%', height: '100%', position: 'absolute', stroke: '#FAFAFA'}}>
              <defs><style>{".cls-1{fill:none;stroke:#FAFAFA;stroke-miterlimit:10;}"}</style></defs>
              <g id="圖層_2" data-name="圖層 2">
                <g id="圖層_1-2" data-name="圖層 1">
                  <path d="M91,2A89,89,0,1,1,2,91,89.11,89.11,0,0,1,91,2m0-2a91,91,0,1,0,91,91A91,91,0,0,0,91,0Z"/>
                  <path className="cls-1" d="M113.14,109.53c15.47,5.49,40,14.62,47.36,20l2,6a58.09,58.09,0,0,1,1,10"/>
                  <path className="cls-1" d="M16.5,142.5s0-8,2-12c.08-.16,1.89-3.86,2-4,2.05-2.73,30.84-11.74,49-17.19"/>
                  <path d="M91.5,25A44.51,44.51,0,1,1,47,69.5,44.55,44.55,0,0,1,91.5,25m0-1A45.5,45.5,0,1,0,137,69.5,45.5,45.5,0,0,0,91.5,24Z"/>
                </g>
              </g>
            </svg>
            <span
              style={{display: 'inline-block', width: '70%', position: 'absolute', left: '30%', top: '50%', transform: 'translate(0,-50%)',fontSize: '3.6vh'}}>
              {this.props.userInfo.account}
            </span>
          </div>
        </div>
        <div
          style={this.style.Com_EInfoSide_Date_}>
          <span>{this._render_getDay(editDate)}</span>
          <span>{editDate.getMonth()+1}</span>
          <span>{' 月'}</span>
          <span>{editDate.getDate()}</span>
          <span>{' 日'}</span>
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
