import React from 'react';
import { connect } from "react-redux";
import ImgLayer from './ImgLayer.jsx';

class ImgLayersFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      spotsVisible: true,
      currentMark: this.props.marksStatus.initMark
      //watch out! props marksStatus would update follow the marksvisible,
      //so, careful if need to change state by 'props'!
    };
    this._set_Markvisible = this._set_Markvisible.bind(this);
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._set_spotsVisible = ()=>{this.setState((prevState, props)=>{return {spotsVisible: prevState.spotsVisible? false : true};})};
    this.style={
      Com_ImgLayersFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
      },
      Com_ImgLayersFrame_div_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0',
        boxSizing: 'border-box',
      }
    };
  }

  _set_Markvisible(markKey){
    this.setState((prevState, props)=>{
      let nextState = markKey ? (
        {
          spotsVisible: true,
          currentMark: markKey
        }
      ):(prevState);
      props._set_markOpened(markKey? true:false, markKey); //this, should be a reason to put every interactions states to redux reucer manage
      return nextState;
    });
  }

  _set_layerstatus(){
    let nextCount;
    if(!this.props.unitCurrent.beneathSrc || this.props.moveCount > 99){ //to 200 situations
      nextCount = 200;
    }else{ //the rest, to 100 with beneathSrc
      nextCount = 100;
    }

    this.props._set_layerstatus(true, nextCount, {marksify: false, initMark: "all"});
  }

  render(){
    let portion = Math.abs((this.props.moveCount-100)/100); //we use '100' due to the system was base on the 0, 100, 200 range
    let controledCSS = {
      coverZIndex: this.props.moveCount< 100 ? '2':'1',
      coverOpa: this.props.moveCount < 100 ? portion : '0',
      beneathZIndex: this.props.moveCount< 100 ? '1':'2',
      beneathOpa: (1-portion)
    }
    let Com_ImgLayersFrame_div_cover = Object.assign(
      {opacity: controledCSS.coverOpa, zIndex: controledCSS.coverZIndex},
      this.style.Com_ImgLayersFrame_div_
    ),
    Com_ImgLayersFrame_div_beneath = Object.assign(
      {opacity: controledCSS.beneathOpa, zIndex: controledCSS.beneathZIndex},
      this.style.Com_ImgLayersFrame_div_
    );

    let beneathMarks = {
      list: this.props.unitCurrent.beneathMarksList,
      data: this.props.unitCurrent.beneathMarksData
    },
    coverMarks = {
      list: this.props.unitCurrent.coverMarksList,
      data: this.props.unitCurrent.coverMarksData
    };

    return(
      <div
        style={this.style.Com_ImgLayersFrame}>
        <div
          style={Com_ImgLayersFrame_div_beneath}>
          {
            this.props.unitCurrent.beneathSrc &&
            <ImgLayer
              imgSrc={this.props.unitCurrent.beneathSrc}
              markOpened={this.props.marksStatus.marksify}
              lockify={this.props.lockify}
              spotsVisible={this.state.spotsVisible}
              currentMark={this.state.currentMark}
              marksData={beneathMarks}
              _set_Markvisible={this._set_Markvisible}
              _set_layerstatus={this._set_layerstatus}
              _set_spotsVisible={this._set_spotsVisible}/>
          }
        </div>
        <div
          style={Com_ImgLayersFrame_div_cover}>
          {
            this.props.unitCurrent.coverSrc &&
            <ImgLayer
              imgSrc={this.props.unitCurrent.coverSrc}
              markOpened={this.props.marksStatus.marksify}
              lockify={this.props.lockify}
              spotsVisible={this.state.spotsVisible}
              currentMark={this.state.currentMark}
              marksData={coverMarks}
              _set_Markvisible={this._set_Markvisible}
              _set_layerstatus={this._set_layerstatus}
              _set_spotsVisible={this._set_spotsVisible}/>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayersFrame);
