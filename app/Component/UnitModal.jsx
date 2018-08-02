import React from 'react';
import UnitLayerFrame from './UnitLayerFrame.jsx';
import UnitLayerControl from './UnitLayerControl.jsx';
import UnitActionControl from './UnitActionControl.jsx';

export default class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitName: this.props.unitName,
      unitOverview: this.props.unitOverview,
      coverSrc: null,
      beneathSrc: null,
      coverMarksObj: null,
      beneathMarksObj: null,
      refsArr: null,
      nounsArr: null,
      arthur: null,
      action: null,
      layer: 0,
      marks: true
    };
    this._axios_getUnitData = () => {
      return axios.get('/router/unit/general/mount?unitName='+this.state.unitName, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        }
      })
    };
    this._axios_getUnitImg = (layer)=>{
      return axios.get('/router/img/unitSingle?name='+this.state.unitOverview[layer], {
        headers: {
          'token': window.localStorage['token']
        }
      })
    };
    this._set_axios = (bool) => {this.setState({axios: bool})};
    this._set_makrsVisible = (bool) => {this.setState({marks: bool});};
    this._set_layer = (index) => {this.setState({layer: index});};
    this._handleClick_unitBack = this._handleClick_unitBack.bind(this);
    this.style={
      Com_Modal_UnitModal: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_UnitModal_ImgSection_div: {
        width: '85%',
        height: '93%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_: {
        width: '14%',
        height: '93%',
        position: 'absolute',
        top: '0',
        right: '0'
      },
      Com_UnitModal_ControlSection_back_: {
        width: '50%',
        height: '10%',
        position: 'absolute',
        top: '0%',
        left: '50%'
      },
      Com_UnitModal_ControlSection_back_span: {
        display: 'inline-block',
        float: 'right',
        boxSizing: 'border-box',
        margin: '2% 5%',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitModal_ControlSection_div_layerControl: {
        width: '50%',
        height: '40%',
        position: 'absolute',
        top: '24%',
        left: '20%'
      },
      Com_UnitModal_BottomSection_: {
        width: '85%',
        height: '7%',
        position: 'absolute',
        bottom: '0',
        left: '0'
      },
      Com_UnitModal_BottomSection_arthur_: {
        width: '70%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '1%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.2vh',
        fontWeight: '400',
        color: '#FAFAFA'
      },
      Com_UnitModal_BottomSection_div_: {
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '10%',
        boxSizing: 'border-box',
        padding: '1vh 0',
        fontSize: '2rem',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'cwTeXMing',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitModal_BottomSection_info_: {
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '2%',
        boxSizing: 'border-box',
        fontSize: '2rem',
        textAlign: 'center',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitModal_CornerSection_: {
        width: '15%',
        height: '7%',
        position: 'absolute',
        right: '0',
        bottom: '0'
      }
    }
  }

  _handleClick_unitBack(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._close_modal_Unit();
  }

  componentDidMount(){
    const self = this;
    let beneathify = !!this.state.unitOverview['img_beneath'];
    let axiosArr = [this._axios_getUnitData(),this._axios_getUnitImg('img_cover')];
    if(beneathify){axiosArr.push(this._axios_getUnitImg('img_beneath'))};
    axios.all(axiosArr).then(
      axios.spread(function(resData, resImgCover, resImgBeneath){
        self.setState({
          coverSrc: resImgCover.data,
          beneathSrc: beneathify?resImgBeneath.data:null,
          coverMarksObj: resData.data.coverMarksObj,
          beneathMarksObj: resData.data.beneathMarksObj,
          refsArr: resData.data.refsArr,
          nounsArr: resData.data.nounsArr,
          arthur: resData.data.arthur,
          action: resData.data.action
        });
      })
    )
  }

  render(){
    return(
      <div
        style={this.style.Com_Modal_UnitModal}>
        <div
          style={this.style.Com_UnitModal_BottomSection_}>
          {
            this.state.arthur &&
            <span
              style={this.style.Com_UnitModal_BottomSection_arthur_}>
              {this.state.arthur}
            </span>
          }
          {
            this.state.nounsArr &&
            <div
              style={this.style.Com_UnitModal_BottomSection_div_}>
              {this.state.nounsArr[0]}
            </div>
          }
          <span style={this.style.Com_UnitModal_BottomSection_info_}>{" i "}</span>
        </div>
        <div
          style={this.style.Com_UnitModal_CornerSection_}>
          <UnitActionControl
            unitName={this.state.unitName}
            action={this.state.action}
            _set_axios={this._set_axios}/>
        </div>
        <div
          style={this.style.Com_UnitModal_ControlSection_}>
          <div
            style={this.style.Com_UnitModal_ControlSection_back_}>
            <span
              style={this.style.Com_UnitModal_ControlSection_back_span}
              onClick={this._handleClick_unitBack}>
              {" X "}
            </span>
          </div>
          <div
            style={this.style.Com_UnitModal_ControlSection_div_layerControl}>
            <UnitLayerControl
              layer={this.state.layer}
              marks = {this.state.marks}
              _set_makrsVisible={this._set_makrsVisible}
              _set_layer={this._set_layer}/>
          </div>
        </div>
        <div
          style={this.style.Com_UnitModal_ImgSection_div}>
          <UnitLayerFrame
            layer={this.state.layer}
            marks = {this.state.marks}
            coverSrc={this.state.coverSrc}
            beneathSrc={this.state.beneathSrc}
            coverMarksObj={this.state.coverMarksObj}
            beneathMarksObj={this.state.beneathMarksObj}/>
        </div>
      </div>
    )
  }
}
