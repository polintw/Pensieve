import React from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import SvgPropic from '../../Component/SvgPropic.jsx';

export default class MainIndexRaws extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._style_MainIndexRaws_number = this._style_MainIndexRaws_number.bind(this);
    this.style={
      withinCom_MainIndexRaws_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '2vh 0',
      },
      withinCom_MainIndexRaws_unit_forOne: {
        display: 'inline-block',
        width: '100%',
        height: '43vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_MainIndexRaws_unit_forTwo: {
        display: 'inline-block',
        width: '49%',
        height: '43vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_MainIndexRaws_unit_forThree: {
        display: 'inline-block',
        width: '32%',
        height: '43vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_MainIndexRaws_unit_div_img: {
        width: '120%',
        height: 'auto'
      },
      withinCom_MainIndexRaws_unit_div_content_: {
        width: '100%',
        height: '15%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      },
      withinCom_MainIndexRaws_unit_div_content_author_: {
        width: '24%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '4%',
        boxSizing: 'border-box',
      }
    }
  }

  _style_MainIndexRaws_number(){
    switch (this.props.number) {
      case 1:
        return this.style.withinCom_MainIndexRaws_unit_forOne
        break;
      case 2:
        return this.style.withinCom_MainIndexRaws_unit_forTwo
        break;
      case 3:
        return this.style.withinCom_MainIndexRaws_unit_forThree
        break;
      default:
        return this.style.withinCom_MainIndexRaws_unit_forOne
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let units = [];
    let point = this.props.point;
    let divStyle = this._style_MainIndexRaws_number();
    for(let i=0 ; i< self.props.number; i++){
      let unitName = self.props.unitsList[point];
      let dataValue = unitName ? self.props.unitsBasicSet[unitName]: {pic_layer0: null};
      units.push(
        <div
          key={'key_LtdUnits_unit_'+point}
          style={divStyle}>
          <Link
            to={{
              pathname: "/units/"+unitName,
              state: {from: self.props.location}
            }}>
            <img
              src={'/router/img/'+dataValue.pic_layer0+'?type=thumb'}
              style={self.style.withinCom_MainIndexRaws_unit_div_img}/>
            <div
              style={this.style.withinCom_MainIndexRaws_unit_div_content_}>
              <div
                style={this.style.withinCom_MainIndexRaws_unit_div_content_author_}>
                <SvgPropic/>
              </div>
            </div>
          </Link>
        </div>
      );
      point += 1;
    }

    return(
      <div
        style={this.style.withinCom_MainIndexRaws_}>
        {units}
      </div>
    )
  }
}
