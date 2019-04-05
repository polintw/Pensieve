import React from 'react';
import {connect} from "react-redux";
import {NameMedium} from '../AccountPlate.jsx';
import DateConverter from '../DateConverter.jsx';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '33%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: "11%",
  },
  boxInfoRelative: {
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing:'border-box',
  },
  boxInfoAbsolute: {
    display: 'inline-block',
    position: 'absolute',
    boxSizing:'border-box',
  },
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '2.6vh',
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
        width: '27%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '5%',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_Panel_Info_: {
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '13%',
        boxSizing: 'border-box',
        color: '#FAFAFA'
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
          style={this.style.Com_Modal_Editing_Panel_Info_}>
          <div
            style={Object.assign({}, styleMiddle.boxInfoRelative, {marginRight: '13%'})}>
            <div>
              <NameMedium/>
            </div>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxInfoAbsolute, {top:'0',right:'0'})}>
            <div>
              <DateConverter
                datetime={editDate}/>
            </div>
          </div>
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
