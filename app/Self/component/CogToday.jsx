import React from 'react';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Cabinet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {}
    };
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      selfCom_Cabinet_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitName: null
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState({

      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Cabinet_}>

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
