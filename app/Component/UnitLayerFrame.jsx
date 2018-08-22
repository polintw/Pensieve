import React from 'react';
import UnitLayer from './UnitLayer.jsx';

export default class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coverWidth: '100%',
      coverOpa: '1',
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

  static getDerivedStateFromProps(props, state){
    switch (props.layer) {
      case "0":
        return {
          coverWidth: '100%',
          coverOpa: '1'
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
          coverOpa: '0'
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
      {width: this.state.coverWidth, opacity: this.state.coverOpa},
      this.style.Com_UnitLayerFrame_div_cover
    );
    let Com_UnitLayerFrame_div_beneath = Object.assign(
      {width: this.state.beneathWidth, opacity: this.state.beneathOpa},
      this.style.Com_UnitLayerFrame_div_beneath
    );

    return(
      <div
        style={this.style.Com_UnitLayerFrame}>
        <div
          style={Com_UnitLayerFrame_div_beneath}>
          {
            this.props.beneathSrc &&
            <UnitLayer
              marks={this.props.marks}
              imgSrc={this.props.beneathSrc}
              identity={this.props.identity}
              marksData={this.props.beneathMarksObj}/>
          }
        </div>
        <div
          style={Com_UnitLayerFrame_div_cover}>
          {
            this.props.coverSrc &&
            <UnitLayer
              marks={this.props.marks}
              imgSrc={this.props.coverSrc}
              identity={this.props.identity}
              marksData={this.props.coverMarksObj}/>
          }
        </div>
      </div>
    )
  }
}
