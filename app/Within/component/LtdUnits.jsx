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
      axios: false,
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {},
      markBasic: {},
      userBasic: {},
      rawsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._axios_list_lookout = this._axios_list_lookout.bind(this);
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
      },
      withinCom_LtdUnits_footer: {
        width: '100%',
        height: '10vh',
        position: 'relative'
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

  _axios_list_lookout(url){
    const self = this;
    axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function (res) {
        self.setState((prevState, props)=>{
          let resObj = JSON.parse(res.data);
          return({
            axios: false,
            unitsList: resObj.main.unitsList,
            unitsBasicSet: resObj.main.unitsBasicSet,
            markBasic: resObj.main.markBasic,
            userBasic: resObj.main.userBasic,
          });
        }, self._render_LtdUnitsRaws);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  _render_LtdUnitsRaws(){
    let point = 0;
    let raws = [];
    while (point< this.state.unitsList.length) {
      if(raws.length==1){raws.push(<div style={{width: '100%', height: '28vh'}}></div>);continue;};
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
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/user/cognition/lookout';
      this._axios_list_lookout(url);
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
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
        <div style={this.style.withinCom_LtdUnits_footer}></div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit} style={{position: "fixed"}}>
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
