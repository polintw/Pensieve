import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateResponse from './CreateResponse.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';
import UnitModal from './Unit/UnitModal.jsx';
import UnitEditing from './Unit/UnitEditing.jsx';
import {setUnitCurrent} from "../redux/actions/general.js";
import {unitCurrentInit} from "../redux/constants/globalStates.js";

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
      mode: this.props.unitMode?this.props.unitMode:"viewer",
      warningModel: false
    };
    this.unitId = this.props.match.params.id;
    this.axiosSource = axios.CancelToken.source();
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this.beneathify = !!this.unitInit['pic_layer1'];
    this._render_UnitMode = this._render_UnitMode.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._axios_get_UnitMount = this._axios_get_UnitMount.bind(this);
    this._set_axios = (bool) => {this.setState((prevState, props)=>{return {axios: bool};})};
    this._set_Modalmode = (mode)=>{this.setState((prevState, props)=>{return {mode: mode}})};
    this._reset_UnitMount = ()=>{this._axios_get_UnitMount();};
    this._axios_getUnitData = () => {
      return axios.get('/router/units/'+this.unitId, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        }
      })
    };
    this._axios_getUnitImg = (layer)=>{
      return axios.get('/router/img/'+this.unitInit[layer]+'?type=unitSingle', {
        headers: {
          'token': window.localStorage['token']
        }
      })
    };
    //we set UnitCurrent here to assure the 'beneathSrc' following the UnitInit and also uptodate for each children used as a criteria
    let unitCurrentState = Object.assign({}, unitCurrentInit, {coverSrc: this.unitInit['pic_layer0'], beneathSrc: this.beneathify ? this.unitInit['pic_layer1'] : false});
    this.props._set_store_UnitCurrent(unitCurrentState); //could process in constructor()?

    this.style={

    };
  }

  _close_modal_Unit(){
    if(this.props.unitSubmitting){this.setState({warningModel: true});return;};
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _axios_get_UnitMount(){
    const self = this;
    let axiosArr = [this._axios_getUnitData(),this._axios_getUnitImg('pic_layer0')];
    axiosArr.push(this.beneathify ?　this._axios_getUnitImg('pic_layer1'):Promise.resolve({data: null}));
    self.setState({axios: true});
    axios.all(axiosArr).then(
      axios.spread(function(unitRes, resImgCover, resImgBeneath){
        self.setState({axios: false});
        let resObj = JSON.parse(unitRes.data);
        //we compose the marksset here, but sould consider done @ server
        let keysArr = Object.keys(resObj.main.marksObj);//if any modified or update, keep the "key" as string
        let [coverMarks, beneathMarks] = [{list:[],data:{}}, {list:[],data:{}}];
        keysArr.forEach(function(key, index){
          if(resObj.main.marksObj[key].layer==0){
            coverMarks.data[key]=resObj.main.marksObj[key];
            coverMarks.list.push(key);
          }else{
            beneathMarks.data[key]=resObj.main.marksObj[key]
            beneathMarks.list.push(key);
          }
        })
        //actually, beneath part might need to be rewritten to asure the state could stay consistency
        self.props._set_store_UnitCurrent({
          unitId:self.unitId,
          identity: resObj.main.identity,
          authorBasic: resObj.main.authorBasic,
          coverSrc: resImgCover.data,
          beneathSrc: resImgBeneath.data,
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
    }
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
            unitInit={this.unitInit}
            _set_Modalmode={this._set_Modalmode}
            _close_modal_Unit={this._close_modal_Unit}
            _refer_von_unit={this.props._refer_von_unit}/>)
        break;
      default:
        return (
          <UnitModal
            unitId={this.unitId}
            mode={this.state.mode}
            unitInit={this.unitInit}
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
          <ModalBackground onClose={this._close_modal_Unit} style={{position: "fixed"}}>
            {this._render_UnitMode()}
          </ModalBackground>
        </ModalBox>
        {
          this.state.warningModel &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{backgroundColor: "transparent", position: "fixed"}}>
              <div
                style={{
                  width: '30%',
                  height: '20vh',
                  position: 'absolute',
                  top: '20vh',
                  left: '50%',
                  transform: 'translate(-50%,0)',
                  backgroundColor: 'white'
                }}>
                {"data is submitting, please hold on..."}
              </div>
            </ModalBackground>
          </ModalBox>
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
