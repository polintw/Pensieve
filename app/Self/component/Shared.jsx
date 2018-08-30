import React from 'react';
import CreateShare from '../../Component/CreateShare.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {}
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Shared_top_: {
        width: '100%',
        height: '16vh',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0'
      },
      selfCom_Shared_top_CreateShare_: {
        width: '36%',
        height: '100%',
        verticalAlign: 'middle',
        float: 'right'
      },
      selfCom_Shared_nails_: {
        width: '100%',
        position: "absolute",
        top: '16vh',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      selfCom_Shared_nails_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Shared_nails_div_img: {
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

  _submit_Share_New(dataObj){
    const self = this;
    axios.get('/router/user/cognition/shared', {
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

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitName: null
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/user/cognition/shared', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState({
        unitsList: res.data.main.unitsList,
        unitsBasicSet: res.data.main.unitsBasicSet
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
          key={'key_Shared_nails_'+index}
          unitname={dataKey}
          style={self.style.selfCom_Shared_nails_div_}
          onClick={self._handleClick_Share}>
          <img
            src={'/router/img/'+dataValue.pic_layer0+'?type=thumb'}
            style={self.style.selfCom_Shared_nails_div_img}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={this.style.selfCom_Shared_top_}>
          <div
            style={this.style.selfCom_Shared_top_CreateShare_}>
            <img src="/images/vacancy.png" style={{width: '100%', height: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {shares}
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
