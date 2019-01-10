import React from 'react';

export default class UnitLayerFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_set_layer = this._handleClick_set_layer.bind(this);
    this.style={
      Com_UnitLayerControl: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '5%'
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
    if(this.props.layer == eventIndex){
      this.props.marks ? this.props._set_makrsVisible(false) : this.props._set_makrsVisible(true);
    }else{
      this.props._set_layer(eventIndex);
    }
  }

  render(){
    const self = this;
    let status = this.props.beneathSrc? [0, 1] : [0];
    let circles = status.map(function(binary, index){
      if(self.props.layer == index){
        return( self.props.marks? (
          <svg
            key={'key_Com_UnitLayerControl_svg_'+index}
            index={index}
            style={self.style.Com_UnitLayerControl_svg_button}
            onClick={self._handleClick_set_layer}>
            <circle r="28%" cx="50%" cy="50%" stroke={'#EEDDCC'} fill="none"/>
            <circle r="20%" cx="50%" cy="50%" stroke='#EEDDCC' fill="#EEDDCC"/>
          </svg>
        ) : (
          <svg
            key={'key_Com_UnitLayerControl_svg_'+index}
            index={index}
            style={self.style.Com_UnitLayerControl_svg_button}
            onClick={self._handleClick_set_layer}>
            <circle r="28%" cx="50%" cy="50%" stroke={'#EEDDCC'} fill="none"/>
          </svg>
        ))
      }else{
        <svg
          key={'key_Com_UnitLayerControl_svg_'+index}
          index={index}
          style={self.style.Com_UnitLayerControl_svg_button}
          onClick={self._handleClick_set_layer}>
          <circle r="28%" cx="50%" cy="50%" stroke={'white'} fill="none"/>
        </svg>
      }
    })

    return(
      <div
        style={this.style.Com_UnitLayerControl}>
        {circles}
      </div>
    )
  }
}
