import React from 'react';
import UnitLayerFrame from './UnitLayerFrame.jsx';
import UnitLayerControl from './UnitLayerControl.jsx';

export default class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitName: this.props.unitName,
      coverSrc: null,
      beneathSrc: null,
      coverMarksObj: null,
      beneathMarksObj: null,
      refsArr: null,
      nounsArr: null,
      arthur: null,
      layer: 0,
      marks: true
    };
    this._set_makrsVisible = (bool) => {this.setState({marks: bool});};
    this._set_layer = (index) => {this.setState({layer: index});};
    this.style={
      Com_Modal_UnitModal: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0 -5vw 2vw 3vw'
      },
      Com_UnitModal_ImgSection_div: {
        width: '86%',
        height: '86%',
        position: 'absolute',
        top: '6%',
        left: '0%'
      },
      Com_UnitModal_ControlSection_div: {
        width: '14%',
        height: '92%',
        position: 'absolute',
        top: '0',
        right: '0'
      },
      Com_UnitModal_ControlSection_div_layerControl: {
        width: '50%',
        height: '36%',
        position: 'absolute',
        top: '24%',
        left: '20%'
      },
      Com_UnitModal_BottomSection_div: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: '0',
        left: '0'
      },
      Com_UnitModal_TitleSection_div: {
        width: '86%',
        height: '6%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      }
    }
  }

  componentDidMount(){
    const self = this;
    axios.get('/get/unit/'+self.state.unitName, {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self.setState({
        coverSrc: res.data.coverBase64,
        beneathSrc: res.data.beneathBase64,
        coverMarksObj: res.data.coverMarksObj,
        beneathMarksObj: res.data.beneathMarksObj,
        refsArr: res.data.refsArr,
        nounsArr: res.data.nounsArr,
        arthur: res.data.arthur
      })
    })
  }

  render(){
    return(
      <div
        style={this.style.Com_Modal_UnitModal}>
        <div
          style={this.style.Com_UnitModal_TitleSection_div}>
          {
            this.state.nounsArr &&
            <p>{this.state.nounsArr[0]}</p>
          }
        </div>
        <div
          style={this.style.Com_UnitModal_ImgSection_div}>
          <UnitLayerFrame
            layer={this.state.layer}
            marks = {this.state.marks}
            coverSrc={this.state.coverSrc}
            beneathSrc={this.state.beneathSrc}
            coverMarksObj={this.state.coverMarksObj}
            beneathMarksObj={this.state.beneathMarksObj}/>
        </div>
        <div
          style={this.style.Com_UnitModal_BottomSection_div}>
          {
            this.state.arthur &&
            <span>{this.state.arthur}</span>
          }
          <span>{'推廣'}</span>
          <span>{'收藏'}</span>
        </div>
        <div
          style={this.style.Com_UnitModal_ControlSection_div}>
          <div
            style={this.style.Com_UnitModal_ControlSection_div_layerControl}>
            <UnitLayerControl
              layer={this.state.layer}
              marks = {this.state.marks}
              _set_makrsVisible={this._set_makrsVisible}
              _set_layer={this._set_layer}/>
          </div>
        </div>
      </div>
    )
  }
}
