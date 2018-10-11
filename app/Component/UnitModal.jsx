import React from 'react';
import UnitLayerFrame from './Unit/UnitLayerFrame.jsx';
import UnitLayerControl from './Unit/UnitLayerControl.jsx';
import UnitActionControl from './Unit/UnitActionControl.jsx';
import {AuthorFull, NounsExtensible} from './Unit/UnitComponent.jsx';

export default class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitName: "unitName_"+this.props.unitId,
      coverSrc: null,
      beneathSrc: null,
      coverMarksObj: null,
      beneathMarksObj: null,
      refsArr: null,
      nouns: null,
      authorBasic: null,
      identity: null,
      layer: this.props.unitInit.layer,
      marksify: this.props.unitInit.marksify
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
      return axios.get('/router/img/'+this.props.unitInit[layer]+'?type=unitSingle', {
        headers: {
          'token': window.localStorage['token']
        }
      })
    };
    this._set_axios = (bool) => {this.setState({axios: bool})};
    this._set_makrsVisible = (bool) => {this.setState({marksify: bool});};
    this._set_layer = (index) => {this.setState({layer: index});};
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_unitBack = this._handleClick_unitBack.bind(this);
    this.style={
      Com_Modal_UnitModal: {
        width: '89%',
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
        width: '84%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_layerControl: {
        width: '3%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '13%',
        boxSizing: 'border-box',
        backgroundColor: '#989898'
      },
      Com_UnitModal_ControlSection_: {
        width: '13%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_actionControl_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_Author_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        top: '75%',
        left: '0%',
        boxSizing: 'border-box',
        cursor:'pointer'
      },
      Com_UnitModal_ControlSection_nouns_: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: '20%',
        left: '0',
        boxSizing: 'border-box'
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
      }
    }
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._close_modal_Unit();
  }

  _handleClick_unitBack(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._close_modal_Unit();
  }

  componentDidMount(){
    const self = this;
    let beneathify = !!this.props.unitInit['pic_layer1'];
    let axiosArr = [this._axios_getUnitData(),this._axios_getUnitImg('pic_layer0')];
    if(beneathify){axiosArr.push(this._axios_getUnitImg('pic_layer1'))};
    axios.all(axiosArr).then(
      axios.spread(function(resData, resImgCover, resImgBeneath){
        let resObj = JSON.parse(resData.data);
        let keysArr = Object.keys(resObj.main.marksObj);
        let [coverMarksObj, beneathMarksObj] = [{}, {}];
        keysArr.forEach(function(key, index){
          if(resObj.main.marksObj[key].layer==0){
            coverMarksObj[key]=resObj.main.marksObj[key]
          }else{
            beneathMarksObj[key]=resObj.main.marksObj[key]
          }
        })

        self.setState({
          coverSrc: resImgCover.data,
          beneathSrc: beneathify?resImgBeneath.data:null,
          coverMarksObj: coverMarksObj,
          beneathMarksObj: beneathMarksObj,
          refsArr: resObj.main.refsArr,
          nouns: resObj.main.nouns,
          authorBasic: resObj.main.authorBasic,
          identity: resObj.main.identity
        });
      })
    )
  }

  render(){
    return(
      <div
        style={this.style.Com_Modal_UnitModal}>
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
          {
            this.state.nouns &&
            <div
              style={this.style.Com_UnitModal_ControlSection_nouns_}>
              <NounsExtensible
                nouns={this.state.nouns}
                _handleClick_listNoun={this._refer_toandclose}/>
            </div>
          }
          {
            this.state.authorBasic &&
            <div
              style={this.style.Com_UnitModal_ControlSection_Author_}>
              <AuthorFull
                authorBasic={this.state.authorBasic}
                _handleClick_Author={this._refer_toandclose}/>
            </div>
          }
          <div
            style={this.style.Com_UnitModal_ControlSection_actionControl_}>
            <UnitActionControl
              unitName={this.state.unitName}
              identity={this.state.identity}
              _set_axios={this._set_axios}/>
          </div>
        </div>
        <div
          style={this.style.Com_UnitModal_layerControl}>
          <UnitLayerControl
            layer={this.state.layer}
            marks = {this.state.marksify}
            _set_makrsVisible={this._set_makrsVisible}
            _set_layer={this._set_layer}/>
        </div>
        <div
          style={this.style.Com_UnitModal_ImgSection_div}>
          <UnitLayerFrame
            layer={this.state.layer}
            marksify={this.state.marksify}
            initMark={this.props.unitInit.initMark}
            identity={this.state.identity}
            coverSrc={this.state.coverSrc}
            beneathSrc={this.state.beneathSrc}
            coverMarksObj={this.state.coverMarksObj}
            beneathMarksObj={this.state.beneathMarksObj}/>
        </div>
      </div>
    )
  }
}
