import React from 'react';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Collection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {}
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      selfCom_CabinetCollection_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CabinetCollection_second_: {
        width: '101%',
        position: "relative"
      },
      selfCom_CabinetCollection_second_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_CabinetCollection_second_div_img: {
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
    axios.get('/router/user/unitsList/cabinet?focus=collection', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState({
        unitsList: res.data.unitsList,
        unitsBasicSet: res.data.unitsBasicSet
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasicSet[dataKey];
      return(
        <div
          key={'key_cabinet_Collection_'+index}
          unitname={dataKey}
          style={self.style.selfCom_CabinetCollection_second_div_}
          onClick={self._handleClick_Share}>
          <img
            src={"/router/img/"+dataValue.img_cover+"?type=thumb"}
            style={self.style.selfCom_CabinetCollection_second_div_img}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.selfCom_CabinetCollection_}>
        <div
          style={this.style.selfCom_CabinetCollection_second_}>
          {shares}
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
