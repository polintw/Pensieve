import React from 'react';
import { connect } from "react-redux";
import ImgLayer from './ImgLayer.jsx';

class ImgLayersFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      spotsVisible: true,
      markOpened: this.props.marksStatus.marksify, //watch out! props marksStatus would update follow the marksvisible,
      currentMark: this.props.marksStatus.initMark //so, careful if need to change state by 'props'!
    };
    this._set_Markvisible = this._set_Markvisible.bind(this);
    this._set_spotsVisible = ()=>{this.setState((prevState, props)=>{return {spotsVisible: prevState.spotsVisible? false : true};})};
    this.style={
      Com_ImgLayersFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: 'rgb(16, 16, 16)'
      },
      Com_ImgLayersFrame_div_cover: {
        width: '100%',
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'rgb(16, 16, 16)'
      },
      Com_ImgLayersFrame_div_beneath: {
        width: '100%',
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'rgb(16, 16, 16)'
      }
    };
  }

  _set_Markvisible(markKey){
    this.setState((prevState, props)=>{
      let nextState = markKey ? (
        {
          spotsVisible: true,
          markOpened: true,
          currentMark: markKey
        }
      ):(
        {
          markOpened: false
        }
      );
      props._set_markOpened(markKey? true:false, markKey); //this, should be a reason to put every interactions states to redux reucer manage
      return nextState;
    });
  }

  render(){
    let portion = Math.abs((this.props.moveCount-100)/100);
    let controledCSS = {
      coverZIndex: this.props.moveCount< 100 ? '2':'1',
      coverOpa: this.props.moveCount < 100 ? portion : '0',
      //coverDisplay: this.props.moveCount < 100 ? 'block':'none',
      beneathZIndex: this.props.moveCount< 100 ? '1':'2',
      beneathOpa: this.props.moveCount < 100 ? '1':(1-portion)
      //beneathDisplay: this.props.moveCount < 200 ? 'block' : 'none'
    }
    let Com_ImgLayersFrame_div_cover = Object.assign(
      {opacity: controledCSS.coverOpa, zIndex: controledCSS.coverZIndex},
      this.style.Com_ImgLayersFrame_div_cover
    ),
    Com_ImgLayersFrame_div_beneath = Object.assign(
      {opacity: controledCSS.beneathOpa, zIndex: controledCSS.beneathZIndex},
      this.style.Com_ImgLayersFrame_div_beneath
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
              lockify={this.props.lockify}
              spotsVisible={this.state.spotsVisible}
              currentMark={this.state.currentMark}
              markOpened={this.state.markOpened}
              marksData={beneathMarks}
              _set_Markvisible={this._set_Markvisible}
              _set_spotsVisible={this._set_spotsVisible}/>
          }
        </div>
        <div
          style={Com_ImgLayersFrame_div_cover}>
          {
            this.props.unitCurrent.coverSrc &&
            <ImgLayer
              imgSrc={this.props.unitCurrent.coverSrc}
              lockify={this.props.lockify}
              spotsVisible={this.state.spotsVisible}
              currentMark={this.state.currentMark}
              markOpened={this.state.markOpened}
              marksData={coverMarks}
              _set_Markvisible={this._set_Markvisible}
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
