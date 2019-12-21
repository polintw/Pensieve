import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BelongbyType from './BelongbyType/BelongbyType.jsx';
import BooleanDialog from '../../../../Component/Dialog/BooleanDialog/BooleanDialog.jsx';
import ModalBox from '../../../../Component/ModalBox.jsx';
import ModalBackground from '../../../../Component/ModalBackground.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../../redux/actions/general.js";
import {
  setFlag
} from "../../../../redux/actions/cosmic.js";

const nodeTypeList = ["residence", "stay", "hometown", "used", "used"]; //Notice! redering in BelongbyType depend on length of this list

class Belongs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      typeObj: {},
      nodesList: [],
      nodesSharedCount: {},
      dialog: false,
      chosenNode: '',
      settingType: ''
    };
    this.axiosSource = axios.CancelToken.source();
    this._init_fetch = this._init_fetch.bind(this);
    this._set_sharedCount = this._set_sharedCount.bind(this);
    this._set_choiceAnType = this._set_choiceAnType.bind(this);
    this._set_dialog_cancel = this._set_dialog_cancel.bind(this);
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_DialogMessage = this._render_DialogMessage.bind(this);
    this._handlesubmit_newBelong = this._handlesubmit_newBelong.bind(this);
    this._axios_GET_sharedCount = this._axios_GET_sharedCount.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._axios_GET_recordeShared = this._axios_GET_recordeShared.bind(this);
    this._set_Dialog = ()=> this.setState((prevState,props)=>{ return {dialog: prevState.dialog? false:true};});
  }

  _set_dialog_cancel(){
    this.setState({
      dialog: false,
      chosenNode: '',
      settingType: ''
    })
  }

  _set_choiceAnType(choice, type){

    this.setState({
      dialog: true,
      chosenNode: choice,
      settingType: type
    });
  }

  _handlesubmit_newBelong(){
    const self = this;
    //close the Dialog,And! reset all to wait for new fetch
    //But remember keeping the sumit data alive !
    this.setState({
      typeObj: {},
      nodesList: [],
      nodesSharedCount: {},
      dialog: false,
    });

    let objBelong = {};
    objBelong[this.state.settingType]= this.state.chosenNode; //put nodeId by type

    this._axios_PATCH_belongRecords({belong: objBelong}) //final reload the com to GET new setting
      .then(function (res) {
        self.setState({axios: false});
        //use fetchFlags to refresh data set to render new setting
        self.props._submit_FlagSwitch(['flagBelongRefresh']);
      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });

  }

  _axios_PATCH_belongRecords(submitObj){
    this.setState({axios: true});

    return axios({
      method: 'patch',
      url: '/router/profile/sheetsNodes',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken,
      data: submitObj
    });
  }

  _axios_GET_belongRecords(){
    return axios({
      method: 'get',
      url: '/router/profile/sheetsNodes?present&random&limit=8',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _axios_GET_recordeShared(){
    return axios({
      method: 'get',
      url: '/router/records/nodes?type=shared&limit=5', //the limit 5, considering the possibility of 'repeat' to belong list
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _axios_GET_sharedCount(nodeId){
    return axios({
      method: 'get',
      url: '/router/nouns/'+nodeId+ '/attribution',
      params: {require: 'countShared'},
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _set_sharedCount(nodesList){
    //make axios req by nodesList
    let promiseArr = nodesList.map((nodeId, index)=>{
      return this._axios_GET_sharedCount(nodeId)
    });
    const self = this;
    this.setState({axios: true});

    axios.all(promiseArr)
      .then(results => { //we don't know how many res from .all(), so use general params
        self.setState({axios: false});

        let nodesSharedCount = {}; //obj prepare for new records, combined with current state later
        //we then loop the results, and by the same order, we pick the nodeId from nodesList by index
        //and remember, the result hasn't parse yet
        results.forEach((res, index)=>{
          let resObj = JSON.parse(res.data);
          nodesSharedCount[nodesList[index]] = resObj.main.count;
        });

        self.setState((prevState, props)=>{
          return {
            nodesSharedCount: {...prevState.nodesSharedCount, ...nodesSharedCount} //combined new records to current state by spread
          }
        });

      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });
  }

  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    axios.all([
      this._axios_GET_belongRecords(),
      this._axios_GET_recordeShared()
    ]).then(
      axios.spread((belongRecord, recordShared)=>{
        self.setState({axios: false}); //set here because we are going to next axios not far away

        let belongObj = JSON.parse(belongRecord.data),
            sharedObj = JSON.parse(recordShared.data);
        let sharedList = sharedObj.main.nodesList;
        if(sharedList.length > belongObj.main.nodesList.length){ //long enouogh to delete repeat node by belong
          sharedList = sharedList.filter((nodeId, index)=>{ return belongObj.main.nodesList.indexOf(nodeId)< 0 })
        }
        //then, concat the lists
        const nodesList= belongObj.main.nodesList.concat(sharedList);
        let typeObj = {used: []};
        nodesList.forEach((nodeId, index)=>{ //and, switch nodesChart to type attribution for rendering convinence
          if(nodeId in belongObj.main.nodesChart) typeObj[belongObj.main.nodesChart[nodeId]] = nodeId
          else typeObj["used"].push(nodeId); //end of 'if'
        });

        self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
        self._set_sharedCount(nodesList); //GET count of each node display

        self.setState((prevState, props)=>{
          return({
            nodesList: nodesList,
            typeObj: typeObj
          });
        });

      })
    ).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //in this component, use fetchFlags to check status of list
    if(this.props.flagBelongRefresh && this.props.flagBelongRefresh != prevProps.flagBelongRefresh){
      this._init_fetch();
      this.props._submit_FlagSwitch(['flagBelongRefresh']);
      //the fetchFlags could become empty(length=0) after the rm.
    }
  }

  componentDidMount() {
    this._init_fetch();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_DialogMessage(){
    let nodeName = (this.state.chosenNode in this.props.nounsBasic)? this.props.nounsBasic[this.state.chosenNode]['name']: '';
    let messageList = [
      {text: this.props.i18nUIString.catalog['messageBelongChoiceinBool'][0], style: {}},
      {text: (nodeName+" "), style: {fontWeight: '700', fontStyle:'italic'}},
      {text: this.props.i18nUIString.catalog['messageBelongChoiceinBool'][1], style: {}},
      {text: (this.state.settingType+" "), style: {fontWeight: '700', fontStyle:'italic'}},
      {text: this.props.i18nUIString.catalog['messageBelongChoiceinBool'][2], style: {}},
    ];

    return messageList;
  }

  _render_BelongList(){
    const nodesDOM = nodeTypeList.map((nodeType, index)=>{
      return (
        <div
          key={"key_BelongByType_"+index}
          className={classnames(styles.boxByType)}>
          <BelongbyType
            {...this.state}
            type={nodeType}
            listIndex={index}
            _set_choiceAnType={this._set_choiceAnType}
            _refer_von_cosmic={this.props._refer_von_cosmic}/>
        </div>
      )
    });
    //and insert "·" at the site between 'hometown' & 'used'
    let decoDOM = (
      <div
        key={"key_BelongByType_listDeco"}
        className={classnames(styles.boxListDeco)}>
        {"．"}
      </div>
    );
    nodesDOM.splice(3, 0, decoDOM);

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBannerBelong)}>
        {this._render_BelongList()}
        {
          this.state.dialog &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(52, 52, 52, 0.36)'}}>
              <div
                className={styles.boxDialog}>
                <BooleanDialog
                  customButton={"submitting"}
                  message={this._render_DialogMessage()}
                  _positiveHandler={this._handlesubmit_newBelong}
                  _negativeHandler={this._set_dialog_cancel}/>
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
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    fetchFlags: state.fetchFlags
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Belongs));
