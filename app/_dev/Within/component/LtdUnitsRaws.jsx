import React from 'react';
import cxBind from 'classnames/bind';

export default class LtdUnitsRaws extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._style_LtdUnitsRaws_number = this._style_LtdUnitsRaws_number.bind(this);
    this.style={
      withinCom_LtdUnitsRaws_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      withinCom_LtdUnitsRaws_unit_forOne: {
        display: 'inline-block',
        width: '100%',
        height: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_LtdUnitsRaws_unit_forTwo: {
        display: 'inline-block',
        width: '49%',
        height: '43vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_LtdUnitsRaws_unit_forThree: {
        display: 'inline-block',
        width: '32%',
        height: '43vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_LtdUnitsRawsRaws_unit_div_img: {
        width: '150%',
        height: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      }
    }
  }

  _style_LtdUnitsRaws_number(){
    switch (this.props.number) {
      case 1:
        return this.style.withinCom_LtdUnitsRaws_unit_forOne
        break;
      case 2:
        return this.style.withinCom_LtdUnitsRaws_unit_forTwo
        break;
      case 3:
        return this.style.withinCom_LtdUnitsRaws_unit_forThree
        break;
      default:
        return this.style.withinCom_LtdUnitsRaws_unit_forOne
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let units = [];
    let point = this.props.point;
    let divStyle = this._style_LtdUnitsRaws_number();
    for(let i=0 ; i< self.props.number; i++){
      let unitName = self.props.unitsList[point];
      let dataValue = unitName ? self.props.unitsDataSet[unitName]: {img_cover: null};
      units.push(
        <div
          key={'key_LtdUnits_unit_'+point}
          unitname={unitName}
          style={divStyle}
          onClick={self.props._handleClick_Share}>
          <img
            src={dataValue.img_cover}
            style={self.style.withinCom_LtdUnitsRawsRaws_unit_div_img}/>
        </div>
      );
      point += 1;
    }

    return(
      <div
        style={this.style.withinCom_LtdUnitsRaws_}>
        {units}
      </div>
    )
  }
}
