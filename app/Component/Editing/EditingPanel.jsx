import React from 'react';
import {connect} from "react-redux";
import {NameMedium} from '../AccountPlate.jsx';
import DateConverter from '../DateConverter.jsx';

const generalStyle = { //could included in a global style sheet
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  }
}

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  boxInlineRelative: {
    display: 'inline-block',
    position: 'relative',
    boxSizing:'border-box',
  },
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '2.4vh',
    backgroundColor: "#e6e6e6",
    cursor: 'pointer'
  },
  spanEditingDestiny: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.14rem',
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

      },
      Com_Modal_Editing_Panel_Destiny_: {
        width: '18%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '8%',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_Panel_Info_: {
        position: 'absolute',
        bottom: '0%',
        left: '11%',
        boxSizing: 'border-box',
      }
    }
  }


  render(){
    let editDate = new Date();
    return(
      <div
        style={generalStyle.absolute_FullVersion}>
        <div
          style={this.style.Com_Modal_Editing_Panel_Destiny_}>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton, {width: '16%',marginRight: '20%',cursor: 'pointer'})}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 17.07 17.07"
              className={'centerAlignChild'}
              style={{
                maxWidth: '100%',
                maxHeight: '60%'
              }}
              onClick={this.props._handleClick_Editing_Cancell}>
              <defs><style>{".cls-1-UnitClose{opacity:0.57;}.cls-2-UnitClose{fill:none;stroke:#ededed;stroke-linecap:square;stroke-miterlimit:10;stroke-width:2px;}"}</style></defs>
              <g id="圖層_2" data-name="圖層 2">
                <g className="cls-1-UnitClose">
                  <line className="cls-2-UnitClose" x1="1.41" y1="15.44" x2="15.44" y2="1.41"/>
                  <line className="cls-2-UnitClose" x1="15.65" y1="15.65" x2="1.63" y2="1.63"/>
                </g>
              </g>
            </svg>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton, {width: '45%'})}>
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
            style={Object.assign({}, styleMiddle.boxInlineRelative, {color: '#FAFAFA'})}>
            <div
              style={{display: 'inline-block',paddingRight:'2vw'}}>
              <NameMedium/>
            </div>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxInlineRelative, {color: '#e6e6e6'})}>
            <DateConverter
              datetime={editDate}/>
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
