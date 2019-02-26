import React from 'react';
import { connect } from "react-redux";
import UnitLayer from './UnitLayer.jsx';

export default class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coverWidth: '100%',
      coverOpa: '1',
      coverTop: '1%',
      beneathWidth: '100%',
      beneathOpa: '1'
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

  static getDerivedStateFromProps(props, state){
    switch (props.layer) {
      case "0":
        return {
          coverWidth: '100%',
          coverOpa: '1',
          coverTop: '1%'
        }
        break;
      case "1":
        return {
          coverOpa: '0.5'
        }
        break;
      case "2":
        return {
          coverWidth: '0',
          coverOpa: '0',
          coverTop: '100%'
        }
        break;
      case "3":
        return {
          coverWidth: '0',
          coverOpa: '0',
          beneathOpa: '0.5'
        }
        break;
      case "4":
        return {
          coverWidth: '0',
          coverOpa: '0',
          beneathOpa: '0',
          beneathWidth: '0'
        }
        break;
      default:
        return null
    }
  }

  render(){
    let Com_UnitLayerFrame_div_cover = Object.assign(
      {width: this.state.coverWidth, opacity: this.state.coverOpa, top: this.state.coverTop},
      this.style.Com_UnitLayerFrame_div_cover
    );
    let Com_UnitLayerFrame_div_beneath = Object.assign(
      {width: this.state.beneathWidth, opacity: this.state.beneathOpa},
      this.style.Com_UnitLayerFrame_div_beneath
    );

    let initMark = this.props.initMark;
    let beneathMarks = {
      list: this.props.unitCurrent.beneathMarksList,
      data: this.props.unitCurrent.beneathMarksData
    };
    let coverMarks = {
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
              marksify={this.props.marksify}
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
              marksify={this.props.marksify}
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
)(UnitModal);
