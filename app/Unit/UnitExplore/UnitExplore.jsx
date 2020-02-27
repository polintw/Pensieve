import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Theater from '../Theater/Theater.jsx';
import Related from '../Related/Related.jsx';
import {
  _axios_getUnitData,
  _axios_getUnitImgs
} from '../utils.js';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import {setUnitCurrent} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/states/constants.js";

class UnitExplore extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._close_theater = this._close_theater.bind(this);
    this._set_UnitCurrent = this._set_UnitCurrent.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._reset_UnitMount = ()=>{this._set_UnitCurrent();};
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    //and add condition to distinguish diff URL
    let params = new URLSearchParams(this.props.location.search);
    let paramsTheater = params.has('theater'); //bool, true if there is 'theater'
    if(paramsTheater) document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _close_theater(){
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _set_UnitCurrent(){
    const self = this;
    this.setState({axios: true});

    let promiseArr = [
      new Promise((resolve, reject)=>{_axios_getUnitData(this.axiosSource.token, this.unitId);}),
      new Promise((resolve, reject)=>{_axios_getUnitImgs(this.axiosSource.token, this.unitId);})
    ];
    Promise.all(promiseArr)
    .then(([unitRes, imgsBase64])=>{
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
        refsArr: resObj.main.refsArr,
        createdAt: resObj.main.createdAt
      });
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //1) modify <body> first depend on current view status
    if(this.paramsTheater) document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
    else{
      document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;")
      //2) in state, if 'close' is true but the paramsTheater was false
      //that's mean the Redirect happened, & should not redirect again
      if(this.state.close) this.setState({close: false});
    };
    //3) becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    //but Notice! always check the diff between the current & pre id from 'path search'
    //due to this is the only reliable and stable source (compare to the unitCurrent)
    let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.unitId !== prevParams.get('unitId')){
      //reset UnitCurrent to clear the view
      //and Don't worry about the order between state reset, due to the Redux would keep always synchronized
      let unitCurrentState = Object.assign({}, unitCurrentInit);
      this.props._set_store_UnitCurrent(unitCurrentState);
      this._set_UnitCurrent();
    };
  }

  componentDidMount(){
    //because we fetch the data of Unit only from this file,
    //now we need to check if it was necessary to fetch or not in case the props.unitCurrent has already saved the right data we want
    this._set_UnitCurrent();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    //last, make sure the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.paramsTheater = params.has('theater'); //declaim here and would be used throughout the life cycle
    this.unitId = params.get('unitId');

    if(this.state.close){return <Redirect to={{
        pathname: this.props.location.pathname,
        search: '?unitId='+this.unitId,
        state: this.props.location.state //keep the state as props, perhaps need to increase 'current location' for 'back' use
      }}/>};

    return(
      <div>
        <div
          className={styles.boxRelated}>
          <Related
            {...this.props}/>
          <div className={styles.footer}/>
        </div>
        { this.paramsTheater &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: 'rgba(11,11,11,0.98)'}}>
              <Theater
                {...this.props}
                _construct_UnitInit={this._construct_UnitInit}
                _reset_UnitMount={this._reset_UnitMount}
                _close_theaterHeigher={this._close_theater}/>
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
)(UnitExplore));
