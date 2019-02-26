import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import UnitModal from './Unit/UnitModal.jsx';
import AuthorModal from './Unit/AuthorModal.jsx';
import ResModal from './Unit/ResModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';
import {setUnitCurrent} from "../redux/actions/general.js";
import {unitCurrentInit} from "../redux/constants/globalStates.js";

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
      mode: this.props.unitMode?this.props.unitMode:false,
      warningModel: false
    };
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.unitId = this.props.match.params.id;
    this.axiosSource = axios.CancelToken.source();
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this._set_axios = (bool) => {this.setState((prevState, props)=>{return {axios: bool};})};
    this._set_Modalmode = (mode)=>{this.setState((prevState, props)=>{return {mode: mode}})};
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

  componentDidMount(){
    const self = this;
    self.props._set_store_UnitCurrent(unitCurrentInit); //could process in constructor()?

    let beneathify = !!this.unitInit['pic_layer1'];
    let axiosArr = [this._axios_getUnitData(),this._axios_getUnitImg('pic_layer0')];
    if(beneathify){axiosArr.push(this._axios_getUnitImg('pic_layer1'))};
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
          beneathSrc: beneathify?resImgBeneath.data:null,
          coverMarkslist:coverMarks.list,
          coverMarksData:coverMarks.marksData,
          beneathMarkslist:beneathMarks.list,
          beneathMarksData:beneathMarks.marksData,
          nouns: resObj.main.nouns,
          inspired: [],
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.state.close){return <Redirect to={this.props.location.state.from}/>}

    return(
      <div>
        <ModalBox containerId="root">
          <ModalBackground onClose={this._close_modal_Unit} style={{position: "fixed"}}>
            {
              this.state.mode=="editing"&&this.props.unitCurrent.identity=="author"?(
                <AuthorModal
                  mode={this.state.mode}
                  _set_Modalmode={this._set_Modalmode}
                  _refer_von_unit={this.props._refer_von_unit}/>
            ):(
                <div>
                  <ResModal
                    unitId={this.unitId}
                    mode={this.state.mode}
                    _set_Modalmode={this._set_Modalmode}
                    _refer_von_unit={this.props._refer_von_unit}/>
                  <UnitModal
                    unitId={this.unitId}
                    mode={this.state.mode}
                    unitInit={this.unitInit}
                    _set_Modalmode={this._set_Modalmode}
                    _close_modal_Unit={this._close_modal_Unit}
                    _refer_von_unit={this.props._refer_von_unit}/>
                </div>
              )
            }
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
