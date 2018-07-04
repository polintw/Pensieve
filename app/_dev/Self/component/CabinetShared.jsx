import React from 'react';
import CreateShare from '../../Component/CreateShare.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class CabinetShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsDataSet: {}
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._handleClick_unitModal_clear = this._handleClick_unitModal_clear.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      selfCom_CabinetShared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CabinetShared_first_: {
        width: '100%',
        height: '36vh',
        position: 'relative'
      },
      selfCom_CabinetShared_first_div: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_CabinetShared_first_div_img: {
        width: '100%',
        height: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },
      selfCom_CabinetShared_nav_: {
        width: '100%',
        height: '8vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: ' 3vh 0'
      },
      selfCom_CabinetShared_nav_CreateShare: {
        width: '36%',
        height: '96%',
        position: 'relative',
        float: 'right'
      },
      selfCom_CabinetShared_nav_span: {
        display: 'inilne-block',
        width: '18%',
        position: 'relative',
        float: 'left',
        top: '50%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        margin: '0 3% 0 0',
        borderRight: 'solid 1px black',
        fontSize: '2.7vh',
        letterSpacing: '0.2vh',
        color: '#A99056',
        cursor: 'pointer'
      },
      selfCom_CabinetShared_second_: {
        width: '101%',
        position: "relative"
      },
      selfCom_CabinetShared_second_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_CabinetShared_second_div_img: {
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

  _handleClick_unitModal_clear(){
    this.setState({unitModalify: false, focusUnitName: null});
  }

  _submit_Share_New(dataObj){
    axios.get('/get/user/shared?purpose=cabinet', {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self.setState({
        unitsList: res.data.unitsList,
        unitsDataSet: res.data.unitsDataSet
      })
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('/get/user/shared?purpose=cabinet', {
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
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsDataSet[dataKey];
      return(
        <div
          key={'key_Shared_Shares_share_'+index}
          unitname={dataKey}
          style={self.style.selfCom_CabinetShared_second_div_}
          onClick={self._handleClick_Share}>
          <img
            src={dataValue.img_cover}
            style={self.style.selfCom_CabinetShared_second_div_img}/>
        </div>
      )
    })
    shares.shift();

    return(
      <div
        style={this.style.selfCom_CabinetShared_}>
        <div
          style={this.style.selfCom_CabinetShared_first_}>
          {
            this.state.unitsList.length &&
            <div
              unitname={this.state.unitsList[0]}
              style={self.style.selfCom_CabinetShared_first_div}
              onClick={self._handleClick_Share}>
              <img
                src={this.state.unitsDataSet[this.state.unitsList[0]].img_cover}
                style={self.style.selfCom_CabinetShared_first_div_img}/>
            </div>
          }
        </div>
        <nav
          style={this.style.selfCom_CabinetShared_nav_}>
          <span style={this.style.selfCom_CabinetShared_nav_span}>{"COLLECTION"}</span>
          <span style={this.style.selfCom_CabinetShared_nav_span}>{"BROADCAST"}</span>
          <span style={this.style.selfCom_CabinetShared_nav_span}>{"SHARED"}</span>
          <div
            style={this.style.selfCom_CabinetShared_nav_CreateShare}>
            <img src="/vacancy.png" style={{width: '100%', height: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}/>
          </div>
        </nav>
        <div
          style={this.style.selfCom_CabinetShared_second_}>
          {shares}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._handleClick_unitModal_clear}>
              <UnitModal
                unitName={this.state.focusUnitName}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
