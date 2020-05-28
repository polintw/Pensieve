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
import BooleanDialog from '../../../../Components/Dialog/BooleanDialog/BooleanDialog.jsx';
import ModalBox from '../../../../Components/ModalBox.jsx';
import ModalBackground from '../../../../Components/ModalBackground.jsx';
import {
  _axios_GET_belongRecords,
  _axios_PATCH_belongRecords
} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  fetchBelongRecords
} from "../../../../redux/actions/general.js";

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
      settingType: type,
      searchModal: false
    });
  }

  _handlesubmit_newBelong(){
    const self = this;
    //close the Dialog,And! reset all to wait for new fetch
    //But remember keeping the sumit data alive !
    this.setState({
      dialog: false,
    });

    let submitObj = {
      category: this.state.settingType,
      nodeId: this.state.chosenNode
    };

    _axios_PATCH_belongRecords(this.axiosSource.cancelToken, submitObj) //final reload the com to GET new setting
      .then(function (resObj) {
        self.setState({axios: false});
        self.props._fetch_belongRecords(); //calling action to refresh loca records

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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

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
        className={classnames(styles.comBelongSet)}>
        <div>
          <BelongsbyType
            _set_searchModal={this._set_searchModal}/>
        </div>
        <div>
          <SetByTypes
            _set_searchModal={this._set_searchModal}/>
        </div>

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
    _fetch_belongRecords: () => {dispatch(fetchBelongRecords())},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongsSet));
