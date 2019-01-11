import React from 'react';

export default class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_set_layer = this._handleClick_set_layer.bind(this);
    this._handleClick_set_marksVisible = this._handleClick_set_marksVisible.bind(this);
    this.style={
      Com_UnitLayerControl: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        paddingTop: "1vh"
      },
      Com_UnitLayerControl_bar: {
        width: '96%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '5%',
        boxSizing: 'border-box',
        boxShadow: '-2px 1px 5px',
        backgroundColor: '#AAAAAA',
        cursor: 'pointer'
      },
      Com_UnitLayerControl_svg_button: {
        width: '90%',
        height: '15%',
        position: 'relative',
        cursor: 'pointer'
      }
    };
  }

  _handleClick_set_layer(event){
    event.preventDefault();
    event.stopPropagation();
    let eventIndex =event.currentTarget.getAttribute('index');
    this.props._set_layer(eventIndex);
  }

  _handleClick_set_marksVisible(event){
    event.preventDefault();
    event.stopPropagation();
    this.props.marks ? this.props._set_makrsVisible(false) : this.props._set_makrsVisible(true);
  }

  render(){
    let layerCover = this.props.layer == 0? true : false;

    return(
      <div
        style={this.style.Com_UnitLayerControl}>
        <div
          index={0}
          style={{width: '100%', height: this.props.beneathSrc? '40%':'80%', position: "relative", cursor:"pointer"}}
          onClick={this._handleClick_set_layer}>
          <div
            style={Object.assign({display: layerCover? 'block': 'none'}, this.style.Com_UnitLayerControl_bar)}
            onClick={this._handleClick_set_marksVisible}></div>
        </div>
        {
          this.props.beneathSrc &&
          <div
          index={1}
          style={{width: '100%', height: '40%', position: "relative", cursor:"pointer"}}
          onClick={this._handleClick_set_layer}>
          <div
            style={Object.assign({display: layerCover? 'none': 'block'}, this.style.Com_UnitLayerControl_bar)}
            onClick={this._handleClick_set_marksVisible}></div>
          </div>
        }
      </div>
    )
  }
}
