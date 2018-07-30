import React from 'react';
import cxBind from 'classnames/bind';
import LtdUnitsRaws from './LtdUnitsRaws.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class LtdUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {},
      rawsArr: []
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._render_LtdUnitsRaws = this._render_LtdUnitsRaws.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      withinCom_LtdUnits_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1vh 0 0 0'
      },
      withinCom_LtdUnits_div_: {
        width: '101%',
        position: "relative"
      }
    }
  }

  _handleClick_Share(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusUnitName: event.currentTarget.getAttribute('unitname')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitName: null
    })
  }

  _render_LtdUnitsRaws(){
    let point = 0;
    let raws = [];
    while (point< this.state.unitsList.length) {
      let number = Math.floor(Math.random()*3)+1;
      if(this.state.unitsList.length-point < number){number = this.state.unitsList.length-point;};
      raws.push(
        <LtdUnitsRaws
          key={'key_LtdUnits_raw_'+point+'_'+number}
          point={point}
          number={number}
          unitsList={this.state.unitsList}
          unitsBasicSet={this.state.unitsBasicSet}
          _handleClick_Share={this._handleClick_Share}/>
      )
      point +=  number;
    };
    this.setState({rawsArr: raws});
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/user/unitsList/ltd', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState((prevState, props) => {
        return({unitsList: res.data.unitsList, unitsBasicSet: res.data.unitsBasicSet});
      }, self._render_LtdUnitsRaws);
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_LtdUnits_}>
        <div
          style={this.style.withinCom_LtdUnits_div_}>
          {this.state.rawsArr}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitName={this.state.focusUnitName}
                unitOverview={this.state.unitsBasicSet[this.state.focusUnitName]}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
