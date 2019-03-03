import React from 'react';
import { connect } from "react-redux";
import UnitLayer from './UnitLayer.jsx';

class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitLayerFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: 'black'
      },
      Com_UnitLayerFrame_div_cover: {
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'black'
      },
      Com_UnitLayerFrame_div_beneath: {
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'black'
      }
    };
  }

  render(){
    let portion = Math.abs((this.props.moveCount-100)/100);
    let controledCSS = {
      coverWidth: this.props.moveCount < 100 ? '100%':'0',
      coverOpa: this.props.moveCount > 0 ? portion : '1',
      coverDisplay: this.props.moveCount < 100 ? 'block':'none',
      beneathWidth: this.props.moveCount < 200 ? '100%':'0',
      beneathOpa: this.props.moveCount > 100 ? (1-portion) : '1',
      beneathDisplay: this.props.moveCount < 200 ? 'block' : 'none'
    }
    let Com_UnitLayerFrame_div_cover = Object.assign(
      {width: controledCSS.coverWidth, opacity: controledCSS.coverOpa, display: controledCSS.coverDisplay},
      this.style.Com_UnitLayerFrame_div_cover
    ),
    Com_UnitLayerFrame_div_beneath = Object.assign(
      {width: controledCSS.beneathWidth, opacity: controledCSS.beneathOpa, display: controledCSS.beneathDisplay},
      this.style.Com_UnitLayerFrame_div_beneath
    );

    let initMark = this.props.unitInit.initMark;
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
        style={this.style.Com_UnitLayerFrame}>
        <div
          style={Com_UnitLayerFrame_div_beneath}>
          {
            this.props.unitCurrent.beneathSrc &&
            <UnitLayer
              imgSrc={this.props.unitCurrent.beneathSrc}
              lockify={this.props.lockify}
              initMark={initMark in beneathMarks? initMark : "all"}
              marksData={beneathMarks}/>
          }
        </div>
        <div
          style={Com_UnitLayerFrame_div_cover}>
          {
            this.props.unitCurrent.coverSrc &&
            <UnitLayer
              imgSrc={this.props.unitCurrent.coverSrc}
              lockify={this.props.lockify}
              initMark={initMark in coverMarks? initMark : "all"}
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
)(UnitLayerFrame);
