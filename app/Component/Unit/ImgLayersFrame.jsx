import React from 'react';
import { connect } from "react-redux";
import ImgLayer from './ImgLayer.jsx';

const initMark = this.props.unitInit.initMark;

class ImgLayersFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentCoverMark: initMark in this.props.unitCurrent.coverMarksData? initMark : "all",
      currentBeneathMark: initMark in this.props.unitCurrent.beneathMarksData? initMark : "all"
    };
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
              marksOpen={this.state.currentBeneathMark}
              marksData={beneathMarks}/>
          }
        </div>
        <div
          style={Com_ImgLayersFrame_div_cover}>
          {
            this.props.unitCurrent.coverSrc &&
            <ImgLayer
              imgSrc={this.props.unitCurrent.coverSrc}
              lockify={this.props.lockify}
              marksOpen={this.state.currentCoverMark}
              marksData={coverMarks}/>
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
