import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import UnitModal from './UnitModal.jsx';
import UnitEditing from './UnitEditing.jsx';
import CreateResponse from '../Component/CreateResponse.jsx';
import ModalBox from '../Component/ModalBox.jsx';
import ModalBackground from '../Component/ModalBackground.jsx';
import WarningModal from '../Component/WarningModal.jsx';
import {setUnitCurrent} from "../redux/actions/general.js";
import {unitCurrentInit} from "../redux/constants/globalStates.js";

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
      mode: this.props.unitMode?this.props.unitMode:"viewer",
      warningModal: false,
      warningType: null
    };
    this.unitId = this.props.match.params.id;
    this.axiosSource = axios.CancelToken.source();
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this._render_UnitMode = this._render_UnitMode.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._axios_getUnitImg = this._axios_getUnitImg.bind(this);
    this._axios_getUnitData = this._axios_getUnitData.bind(this);
    this._axios_get_UnitMount = this._axios_get_UnitMount.bind(this);
    this._set_WarningModal_positive = this._set_WarningModal_positive.bind(this);
    this._set_WarningModal_negative = this._set_WarningModal_negative.bind(this);
    this._set_axios = (bool) => {this.setState((prevState, props)=>{return {axios: bool};})};
    this._set_Modalmode = (mode)=>{this.setState((prevState, props)=>{return {mode: mode}})};
    this._reset_UnitMount = ()=>{this._axios_get_UnitMount();};

    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _set_WarningModal_positive(){
    switch (this.state.warningType) {
      case 'submitting':
        this.setState({warningModal: false, warningType: null})
        break;
      case 'close': //confirm close the modal
        this.setState({close: true, warningModal: false, warningType: null})
        break;
      default:
        this.setState({warningModal: false, warningType: null})
    }
  }

  _set_WarningModal_negative(){
    switch (this.state.warningType) {
      case 'close':
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
        break;
      default:
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
    }
  }

  _close_modal_Unit(){
    if(this.props.unitSubmitting){this.setState({warningModal: "data is submitting, please hold on...", warningType: 'submitting'});return;};
    if(this.state.mode=='author_editing'){this.setState({warningModal: "modifications has not yet submitted, are you still going to close the it?", warningType: 'close'});return;};
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _axios_getUnitData(){
    return axios.get('/router/units/'+this.unitId, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    })
  };

  _axios_getUnitImg(){
    const self = this,
          _axios_getUnitImg_base64 = (src)=>{
            return axios.get('/router/img/'+src+'?type=unitSingle', {
              headers: {
                'token': window.localStorage['token']
              }
            });
          };

    return axios.get('/router/units/'+this.unitId+'/src', {
      headers: {
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      let srcCover = resObj.main['pic_layer0'],
          srcBeneath = resObj.main['pic_layer1'];

      return axios.all([
        _axios_getUnitImg_base64(srcCover),
        srcBeneath? _axios_getUnitImg_base64(srcBeneath) : Promise.resolve({data: null})
      ]).then(
        axios.spread((resImgCover, resImgBeneath)=>{
          let imgsBase64 = {
            cover: resImgCover.data,
            beneath: resImgBeneath.data
          }
          return imgsBase64;
        })
      )
    }).catch(function (thrown) {
      throw thrown;
    });
  };


  _axios_get_UnitMount(){
    const self = this;
    let axiosArr = [this._axios_getUnitData(),this._axios_getUnitImg()];
    this.setState({axios: true});

    axios.all(axiosArr).then(
      axios.spread(function(unitRes, imgsBase64){
        self.setState({axios: false});
        let resObj = JSON.parse(unitRes.data);
        //we compose the marksset here, but sould consider done @ server
        let keysArr = Object.keys(resObj.main.marksObj);//if any modified or update, keep the "key" as string
        let [coverMarks, beneathMarks] = [{list:[],data:{}}, {list:[],data:{}}];
        keysArr.forEach(function(key, index){
          if(resObj.main.marksObj[key].layer==0){
            coverMarks.data[key]=resObj.main.marksObj[key];
            coverMarks.list[resObj.main.marksObj[key].serial] = key; //let the list based on order of marks, same as beneath
          }else{
            beneathMarks.data[key]=resObj.main.marksObj[key]
            beneathMarks.list[resObj.main.marksObj[key].serial] = key;
          }
        })
        //actually, beneath part might need to be rewritten to asure the state could stay consistency
        self.props._set_store_UnitCurrent({
          unitId:self.unitId,
          identity: resObj.main.identity,
          authorBasic: resObj.main.authorBasic,
          coverSrc: imgsBase64.cover,
          beneathSrc: imgsBase64.beneath,
          coverMarksList:coverMarks.list,
          coverMarksData:coverMarks.data,
          beneathMarksList:beneathMarks.list,
          beneathMarksData:beneathMarks.data,
          nouns: resObj.main.nouns,
          marksInteraction: resObj.main.marksInteraction,
          broad: false,
          refsArr: resObj.main.refsArr,
          createdAt: resObj.main.createdAt
        });
      })
    ).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  componentDidMount(){
    this._axios_get_UnitMount();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };

    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    //last, recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }

  _render_UnitMode(){
    switch (this.state.mode) {
      case "author_editing":
        return (
          <UnitEditing
            mode={this.state.mode}
            _set_Modalmode={this._set_Modalmode}
            _refer_von_unit={this.props._refer_von_unit}
            _reset_UnitMount={this._reset_UnitMount}/>)
        break;
      case "response":
        return (
          <CreateResponse
            unitId={this.unitId}
            mode={this.state.mode}
            _set_Modalmode={this._set_Modalmode}
            _refer_von_unit={this.props._refer_von_unit}/>)
        break;
      case "viewer":
        return (
          <UnitModal
            unitId={this.unitId}
            mode={this.state.mode}
            initStatus={this.unitInit}
            _set_Modalmode={this._set_Modalmode}
            _close_modal_Unit={this._close_modal_Unit}
            _refer_von_unit={this.props._refer_von_unit}/>)
        break;
      default:
        return (
          <UnitModal
            unitId={this.unitId}
            mode={this.state.mode}
            initStatus={this.unitInit}
            _set_Modalmode={this._set_Modalmode}
            _close_modal_Unit={this._close_modal_Unit}
            _refer_von_unit={this.props._refer_von_unit}/>)
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.state.close){return <Redirect to={this.props.location.state.from}/>}

    return(
      <div>
        <ModalBox containerId="root">
          <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: 'rgba(11,11,11,0.98)'}}>
            {this._render_UnitMode()}
          </ModalBackground>
        </ModalBox>
        {
          this.state.warningModal &&
          <WarningModal
            type={this.state.warningType}
            message={this.state.warningModal}
            _set_WarningModal_positive={this._set_WarningModal_positive}
            _set_WarningModal_negative={this._set_WarningModal_negative}/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Unit));
