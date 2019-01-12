import React from 'react';
import UnitLayer from './UnitLayer.jsx';

export default class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coverDisplay: 'block',
      coverOpa: '1',
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
        width: '100%',
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'black'
      },
      Com_UnitLayerFrame_div_beneath: {
        width: '100%',
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
          coverDisplay: 'block',
          coverOpa: '1'
        }
        break;
      case "1":
        return {
          coverDisplay: 'none',
          coverOpa: '0'
        }
        break;
      default:
        return null
    }
  }

  render(){
    let Com_UnitLayerFrame_div_cover = Object.assign(
      {display: this.state.coverDisplay, opacity: this.state.coverOpa},
      this.style.Com_UnitLayerFrame_div_cover
    );
    let Com_UnitLayerFrame_div_beneath = Object.assign(
      {opacity: this.state.beneathOpa},
      this.style.Com_UnitLayerFrame_div_beneath
    );

    let initMark = this.props.initMark;
    let beneathMarks = this.props.beneathMarks;
    let coverMarks = this.props.coverMarks;

    return(
      <div
        style={this.style.Com_UnitLayerFrame}>
        <div
          style={Com_UnitLayerFrame_div_beneath}>
          {
            this.props.beneathSrc &&
            <UnitLayer
              imgSrc={this.props.beneathSrc}
              marksify={this.props.marksify}
              initMark={initMark in beneathMarks? initMark : "all"}
              identity={this.props.identity}
              marksData={beneathMarks}/>
          }
        </div>
        <div
          style={Com_UnitLayerFrame_div_cover}>
          {
            this.props.coverSrc &&
            <UnitLayer
              imgSrc={this.props.coverSrc}
              marksify={this.props.marksify}
              initMark={initMark in coverMarks? initMark : "all"}
              identity={this.props.identity}
              marksData={coverMarks}/>
          }
        </div>
      </div>
    )
  }
}
