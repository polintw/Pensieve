import React from 'react';
import cxBind from 'classnames/bind';
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
      unitsDataSet: {}
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
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
      },
      withinCom_LtdUnits_div_unit_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      withinCom_LtdUnits_div_unit_img: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
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

  componentDidMount(){
    const self = this;
    axios.get('/get/unit/ltd?id=userid', {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self.setState({
        unitsList: res.data.unitsList,
        unitsDataSet: res.data.unitsDataSet
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let units = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsDataSet[dataKey];
      return(
        <div
          key={'key_Shared_Shares_share_'+index}
          unitname={dataKey}
          style={self.style.withinCom_LtdUnits_div_unit_}
          onClick={self._handleClick_Share}>
          <img
            src={dataValue.img_cover}
            style={self.style.withinCom_LtdUnits_div_unit_img}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.withinCom_LtdUnits_}>
        <div
          style={this.style.withinCom_LtdUnits_div_}>
          {units}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitName={this.state.focusUnitName}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
