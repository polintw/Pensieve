import React from 'react';
import DraftDisplay from './DraftDisplay.jsx';
import SvgBulb from './SvgBulb.jsx';
import UnitModal from './UnitModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';

export default class AppearPath extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitModalify: false,
      focusUnitId: null,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Unit = this._handleClick_Unit.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._render_appearPath_nails = this._render_appearPath_nails.bind(this);
    this.style={
      Com_AppearPath_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Com_AppearPath_nails_: {
        width: '100%',
        position: "absolute",
        top: '16vh',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      Com_AppearPath_nails_nail_: {
        display: 'inline-block',
        width: '42%',
        height: "45vh",
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 1%'
      }
    }
  }

  _handleClick_Unit(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusUnitId: event.currentTarget.getAttribute('unitid')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitId: null
    })
  }

  _render_appearPath_nails(){
    const self = this;
    let nails = [];
    this.state.unitsList.forEach((unitId, index)=>{
      let unitBasic = self.state.unitsBasic[unitId];
      let unitMarks = unitBasic.marksList.map((markId, index)=>{
        return self.state.marksBasic[markId]
      })
      switch (unitBasic.relation) {
        case 'inspired':
          nails.push(
            <div
              key={'key_Nail_Inspired_'+index}
              style={self.style.Com_AppearPath_nails_nail_}>
              <NailIspired
                unitId={unitId}
                unitBasic={unitBasic}
                marksArr = {unitMarks}
                _handleClick_Unit={self._handleClick_Unit}/>
            </div>
          )
          break;
        case 'shared':
          nails.push(
            <div
              key={'key_Nail_Shared_'+index}
              style={self.style.Com_AppearPath_nails_nail_}>
              <NailShared
                unitId={unitId}
                unitBasic={unitBasic}
                marksArr = {unitMarks}
                _handleClick_Unit={self._handleClick_Unit}/>
            </div>
          )
          break;
        default:
          nails.push(
            <div
              key={'key_Nail_Shared_'+index}
              style={self.style.Com_AppearPath_nails_nail_}>
              <NailShared
                unitId={unitId}
                unitBasic={unitBasic}
                marksArr = {unitMarks}
                _handleClick_Unit={self._handleClick_Unit}/>
            </div>
          )
      }
    })
    return nails;
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = this.props.urlParam+"/appearpath"+this.props.urlQuery;
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return {
              axios: false,
              unitsList: resObj.main.unitsList,
              marksBasic: resObj.main.marksBasic,
              unitsBasic: resObj.main.unitsBasic
            }
          });
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
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
        style={this.style.Com_AppearPath_}>
        <div
          style={this.style.Com_AppearPath_nails_}>
          {this._render_appearPath_nails()}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitId={this.state.focusUnitId}
                unitInit={Object.assign(this.state.unitsBasicSet[this.state.focusUnitId], {marksify: true, initMark: "all", layer: 0})}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}

class NailIspired extends React.Component {
  constructor(props){
    super(props);
    this.style={
      Com_Nail_Inspired_: {
        width: '100%',
        height: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        overflow: 'hidden'
      },
      Com_Nail_Inspired_mark_: {
        width: '100%',
        height: '72%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      Com_Nail_Inspired_img: {
        maxWidth: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        opacity: '0.75'
      },
      Com_Nail_Inspired_bulb_: {
        width: '24%',
        height: '20%',
        position: 'absolute',
        top: '60%',
        right: '2%'
      }
    };
  }

  render(){
    return(
      <div
        unitid={this.props.unitId}
        style={this.style.Com_Nail_Inspired_}
        onClick={this.props._handleClick_Unit}>
        <img
          src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
          style={this.style.Com_Nail_Inspired_img}/>
        <div
          style={this.style.Com_Nail_Inspired_mark_}>
          <DraftDisplay
            editorState={this.props.marksArr[0].editorContent}/>
        </div>
        <div
          style={this.style.Com_Nail_Inspired_bulb_}>
          <SvgBulb
            light={true}/>
        </div>
      </div>
    )
  }
}

class NailShared extends React.Component {
  constructor(props){
    super(props);
    this.style={
      Com_Nail_Shared_: {
        width: '100%',
        height: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        overflow: 'hidden'
      },
      Com_Nail_Shared_mark_: {
        width: '100%',
        height: '20%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Nail_Shared_img: {
        maxWidth: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        cursor: 'pointer'
      }
    };
  }

  render(){
    return(
      <div
        unitid={this.props.unitId}
        style={this.style.Com_Nail_Shared_}
        onClick={this.props._handleClick_Unit}>
        <img
          src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
          style={this.style.Com_Nail_Shared_img}/>
        <div
          style={this.style.Com_Nail_Shared_mark_}>
          <DraftDisplay
            editorState={this.props.marksArr[0].editorContent}/>
        </div>
      </div>
    )
  }
}
