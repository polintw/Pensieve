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
  _axios_GET_belongRecords
} from './utils.js';
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

class Belongs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      typeObj: {},
      nodesList: [],
      dialog: false,
      chosenNode: '',
      settingType: ''
    };
    this.axiosSource = axios.CancelToken.source();
    this._init_fetch = this._init_fetch.bind(this);
    this._set_choiceAnType = this._set_choiceAnType.bind(this);
    this._set_dialog_cancel = this._set_dialog_cancel.bind(this);
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_DialogMessage = this._render_DialogMessage.bind(this);
    this._handlesubmit_newBelong = this._handlesubmit_newBelong.bind(this);
    this._axios_PATCH_belongRecords = this._axios_PATCH_belongRecords.bind(this);
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
      dialog: false,
    });

    let objBelong = {};
    objBelong[this.state.settingType]= this.state.chosenNode; //put nodeId by type

    this._axios_PATCH_belongRecords({belong: objBelong}) //final reload the com to GET new setting
      .then(function (res) {
        self.setState({axios: false});
        //refresh locally
        self._init_fetch();
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

  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    _axios_GET_belongRecords(this.axiosSource.cancelToken)
    .then((belongObj)=>{
      self.setState({axios: false}); //set here because we are going to next axios not far away
      let typeObj = {};

      const nodesList= belongObj.main.nodesList;
      nodesList.forEach((nodeId, index)=>{ //and, switch nodesChart to type attribution for rendering convinence
        typeObj[belongObj.main.nodesChart[nodeId]] = nodeId
      });

      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action

      self.setState((prevState, props)=>{
        return({
          nodesList: nodesList,
          typeObj: typeObj
        });
      });
    })
    .catch(function (thrown) {
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
    const typeKeys = Object.keys(this.state.typeObj);
    const nodesDOM = typeKeys.map((nodeType, index)=>{
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

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelong)}>
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
