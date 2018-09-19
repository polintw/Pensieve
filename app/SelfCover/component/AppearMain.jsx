import React from 'react';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Appearance extends React.Component {
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
      selfCoverCom_appear_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCoverCom_appear_nails_: {
        width: '100%',
        position: "absolute",
        top: '16vh',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
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

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCoverCom_appear_}>
        <div
          style={this.style.selfCoverCom_appear_nails_}>

        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitId={this.state.focusUnitName}
                unitInit={Object.assign(this.state.unitsBasicSet[this.state.focusUnitName], {marksify: true, initMark: "all", layer: 0})}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
