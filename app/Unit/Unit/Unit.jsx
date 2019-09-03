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
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';
import {setUnitCurrent} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/constants/globalStates.js";

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
      onSpanBack: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._axios_getUnitImg = this._axios_getUnitImg.bind(this);
    this._axios_getUnitData = this._axios_getUnitData.bind(this);
    this._axios_get_UnitMount = this._axios_get_UnitMount.bind(this);
    this._handleEnter_spanBack = this._handleEnter_spanBack.bind(this);
    this._handleLeave_spanBack = this._handleLeave_spanBack.bind(this);
    this._reset_UnitMount = ()=>{this._axios_get_UnitMount();};
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
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

  _handleEnter_spanBack(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onSpanBack: true
    })
  }

  _handleLeave_spanBack(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onSpanBack: false
    })
  }

  _close_modal_Unit(){
    //close the whole Unit Modal
    //different from the one in Theater, which used only for closing Theater
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    //but Notice! always check the diff between the current & pre id from 'path search'
    //due to this is the only reliable and stable source (compare to the unitCurrent)
    let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.unitId !== prevParams.get('unitId')){
      //reset UnitCurrent to clear the view
      //and Don't worry about the order between state reset, due to the Redux would keep always synchronized
      let unitCurrentState = Object.assign({}, unitCurrentInit);
      this.props._set_store_UnitCurrent(unitCurrentState);
      this._axios_get_UnitMount();
    };
  }

  componentDidMount(){
    //because we fetch the data of Unit only from this file,
    //now we need to check if it was necessary to fetch or not in case the props.unitCurrent has already saved the right data we want
    this._axios_get_UnitMount();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    //last, recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    if(this.state.close){return <Redirect to={this.props.location.state.from}/>}

    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsTheater = params.has('theater'); //bool, true if there is 'theater'
    this.unitId = params.get('unitId');

    return(
      <ModalBox containerId="root">
        <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: (!!paramsTheater)? 'rgba(11,11,11,0.98)': 'rgba(240, 238,233, 0.98)'}}>
          {
            (paramsTheater) ? (
              <Theater
                {...this.props}
                _reset_UnitMount={this._reset_UnitMount}
                _close_theaterHeigher={this._close_modal_Unit}/>
            ): (
              <div
                className={styles.viewRelated}>
                <div
                  className={styles.boxRelated}>
                  <Related
                    {...this.props}/>
                  <div
                    className={classnames(styles.boxSubtitle)}>
                    <span
                      className={classnames(styles.spanRelatedClose)}
                      onClick={(e)=>{e.stopPropagation();e.preventDefault();this._close_modal_Unit()}}>
                      {" close "}
                    </span>
                  </div>
                </div>
                <div
                  className={classnames(styles.boxBack)}
                  onMouseEnter={this._handleEnter_spanBack}
                  onMouseLeave={this._handleLeave_spanBack}>
                  <span
                    className={classnames(styles.spanBack)}
                    style={this.state.onSpanBack?{color: '#333333'}:{}}
                    onClick={(e)=>{e.stopPropagation();e.preventDefault();this._close_modal_Unit()}}>
                    {" ╳ "}
                  </span>
                </div>
              </div>
            )
          }
        </ModalBackground>
      </ModalBox>
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
