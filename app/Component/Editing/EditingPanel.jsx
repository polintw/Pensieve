import React from 'react';
import {connect} from "react-redux";
import {UserPlate} from '../AccountPlate.jsx';
import DateConverter from '../DateConverter.jsx';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '40%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: "8%",
  },
  boxStaticInfo: {
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing:'border-box',
    color: '#FAFAFA'
  },
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '1.6vh',
    backgroundColor: "#e6e6e6",
    cursor: 'pointer'
  },
  spanEditingDestiny: {
    width: '100%',
    fontSize: '1.36rem',
    fontWeight: '400',
    letterSpacing: '0.15rem',
    textAlign: 'center',
    color: 'black'
  }
}

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_EPanel_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_Modal_Editing_Panel_Destiny_: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '11%',
        boxSizing: 'border-box'
      }
    }
  }


  render(){
    let editDate = new Date();
    return(
      <div
        style={this.style.Com_EPanel_}>
        <div
          style={this.style.Com_Modal_Editing_Panel_Destiny_}>
          <div
            style={styleMiddle.boxNavButton}>
            <div
              style={styleMiddle.roundRecBox}
              onClick={this.props._handleClick_Editing_Cancell}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.spanEditingDestiny}>
                {"Cancel"}
              </span>
            </div>
          </div>
          <div
            style={styleMiddle.boxNavButton}>
            <div
              style={styleMiddle.roundRecBox}
              onClick={this.props._handleClick_Editing_Submit}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.spanEditingDestiny}>
                {"Submit"}
              </span>
            </div>
          </div>
        </div>
        <div
          style={Object.assign({}, styleMiddle.boxStaticInfo, {marginLeft: '13%'})}>
          <UserPlate
            userInfo={this.props.userInfo}
            _handleClick_Account={this.props._refer_toandclose}/>
        </div>
        <div
          style={Object.assign({}, styleMiddle.boxStaticInfo, {marginLeft: '5%'})}>
          <DateConverter
            datetime={editDate}/>
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
)(EditingPanel);
