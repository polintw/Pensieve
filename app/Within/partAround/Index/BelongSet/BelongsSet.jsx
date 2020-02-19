import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SetByTypes from './SetByTypes.jsx';
import BelongsbyType from './BelongsbyType/BelongsbyType.jsx';
import SearchModal from './SearchModal/SearchModal.jsx';
import BooleanDialog from '../../../../Component/Dialog/BooleanDialog/BooleanDialog.jsx';
import ModalBox from '../../../../Component/ModalBox.jsx';
import ModalBackground from '../../../../Component/ModalBackground.jsx';
import {
  _axios_GET_belongRecords,
  _axios_PATCH_belongRecords
} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  setBelongsByType,
} from "../../../../redux/actions/within.js";

/*
  this const, belongTypes, was the very foundation of the whole BelongSet.
  it was uesd to render, and PATCH.
  It is no need to match the cols name used at backend.
  Perhaps one day would be replace by customized data from DB.
*/
const belongTypes = ["residence", "homeland"];

class BelongsSet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      chosenNode: '',
      settingType: '',
      dialog: false,
      searchModal: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._init_fetch = this._init_fetch.bind(this);
    this._set_searchModal = this._set_searchModal.bind(this);
    this._set_choiceAnType = this._set_choiceAnType.bind(this);
    this._set_dialog_cancel = this._set_dialog_cancel.bind(this);
    this._render_DialogMessage = this._render_DialogMessage.bind(this);
    this._handlesubmit_newBelong = this._handlesubmit_newBelong.bind(this);
    this._set_Dialog = ()=> this.setState((prevState,props)=>{ return {dialog: prevState.dialog? false:true};});

  }

  _set_dialog_cancel(){
    this.setState({
      dialog: false,
      chosenNode: '',
      settingType: ''
    })
  }

  _set_searchModal(settingType){
    this.setState((prevState, props)=>{
      return {
        settingType: !!settingType ? settingType: '', //param 'settingType' could be empty if it was cancel or finished
        searchModal: prevState.searchModal ? false: true
      };
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
      dialog: false,
    });

    let objBelong = {};
    objBelong[this.state.settingType]= this.state.chosenNode; //put nodeId by type

    _axios_PATCH_belongRecords(this.axiosSource.cancelToken, {belong: objBelong}) //final reload the com to GET new setting
      .then(function (resObj) {
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

  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    _axios_GET_belongRecords(this.axiosSource.cancelToken)
    .then((belongObj)=>{
      self.setState({axios: false}); //set here because we are going to next axios not far away
      let byTypeObj = {};

      const nodesList= belongObj.main.nodesList;
      nodesList.forEach((nodeId, index)=>{ //and, switch nodesChart to type attribution for rendering convinence
        byTypeObj[belongObj.main.nodesChart[nodeId]] = nodeId
      });

      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
      self.props._submit_belongsByType(byTypeObj)
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

  render(){
    return(
      <div
        className={classnames(styles.comBelong)}>

        <BelongsbyType
          _set_searchModal={this._set_searchModal}/>
        <SetByTypes
          belongTypes={belongTypes}
          _set_searchModal={this._set_searchModal}/>

        {
          this.state.searchModal &&
          <div
            className={classnames(styles.boxSearchModal)}>
            <SearchModal
              settingType={this.state.settingType}
              _set_choiceAnType={this._set_choiceAnType}
              _set_searchModal={this._set_searchModal}/>
          </div>
        }

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
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_belongsByType: (obj) => { dispatch(setBelongsByType(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongsSet));
