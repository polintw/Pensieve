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
        boxSizing: 'border-box',
        margin: '2vh 0',
      },
      withinCom_LtdUnitsRaws_unit_forOne: {
        display: 'inline-block',
        width: '100%',
        height: '43vh',
        boxSizing: 'border-box',
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
      withinCom_LtdUnitsRaws_unit_div_img: {
        width: '120%',
        height: 'auto'
      },
      withinCom_LtdUnitsRaws_unit_div_content_: {
        width: '100%',
        height: '15%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      },
      withinCom_LtdUnitsRaws_unit_div_content_author_: {
        width: '24%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '4%',
        boxSizing: 'border-box',
      },
      withinCom_LtdUnitsRaws_unit_div_content_author_svg: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
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
      let dataValue = unitName ? self.props.unitsBasicSet[unitName]: {pic_layer0: null};
      units.push(
        <div
          key={'key_LtdUnits_unit_'+point}
          unitname={unitName}
          style={divStyle}
          onClick={self.props._handleClick_Share}>
          <img
            src={'/router/img/'+dataValue.pic_layer0+'?type=thumb'}
            style={self.style.withinCom_LtdUnitsRaws_unit_div_img}/>
          <div
            style={this.style.withinCom_LtdUnitsRaws_unit_div_content_}>
            <div
              style={this.style.withinCom_LtdUnitsRaws_unit_div_content_author_}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 182"
                style={this.style.withinCom_LtdUnitsRaws_unit_div_content_author_svg}>
                <defs><style>{".cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}"}</style></defs>
                <g id="圖層_2" data-name="圖層 2">
                  <g id="圖層_1-2" data-name="圖層 1">
                    <path d="M91,2A89,89,0,1,1,2,91,89.11,89.11,0,0,1,91,2m0-2a91,91,0,1,0,91,91A91,91,0,0,0,91,0Z"/>
                    <path className="cls-1" d="M113.14,109.53c15.47,5.49,40,14.62,47.36,20l2,6a58.09,58.09,0,0,1,1,10"/>
                    <path className="cls-1" d="M16.5,142.5s0-8,2-12c.08-.16,1.89-3.86,2-4,2.05-2.73,30.84-11.74,49-17.19"/>
                    <path d="M91.5,25A44.51,44.51,0,1,1,47,69.5,44.55,44.55,0,0,1,91.5,25m0-1A45.5,45.5,0,1,0,137,69.5,45.5,45.5,0,0,0,91.5,24Z"/>
                  </g>
                </g>
              </svg>
            </div>
          </div>
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
