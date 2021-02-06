import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../stylesFont.module.css";
import BelongsbyType from './BelongsbyType/BelongsbyType.jsx';
import StartBtn from '../../OnBoard/StartBtn.jsx';
import {
  _axios_PATCH_belongRecords
} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  setMessageBoolean,
} from "../../../../redux/actions/general.js";
import {messageDialogInit} from "../../../../redux/states/constants.js";
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
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_choiceAnType = this._set_choiceAnType.bind(this);
    this._render_DialogMessage = this._render_DialogMessage.bind(this);
    this._handlesubmit_newBelong = this._handlesubmit_newBelong.bind(this);
    this._set_Settingtype = (settingType)=>{this.setState({settingType: settingType})};

  }

  _set_choiceAnType(choice, type){
    const self = this;
    this.setState((prevState, props)=>{
      return {
        chosenNode: choice,
        settingType: type,
      };
    }, ()=>{
      self.props._submit_BooleanDialog({
        render: true,
        customButton: "submitting",
        message: self._render_DialogMessage(),
        handlerPositive: ()=>{self._handlesubmit_newBelong()},
        handlerNegative: ()=>{self.props._submit_BooleanDialog(messageDialogInit.boolean);}
      });
    });
  }

  _handlesubmit_newBelong(){
    const self = this;
    //close the Dialog,And! reset all to wait for new fetch
    //But remember keeping the sumit data alive !
    this.props._submit_BooleanDialog(messageDialogInit.boolean);

    let submitObj = {
      category: this.state.settingType,
      nodeId: this.state.chosenNode
    };

    _axios_PATCH_belongRecords(this.axiosSource.cancelToken, submitObj) //final reload the com to GET new setting
      .then(function (resObj) {
        self.setState({
          axios: false,
          chosenNode: '',
          settingType: '',
        });
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
    /*
    In fact, the BelongsSet under /Around was only used in 'onBoard' process,
    always under tokenstatus 'newly' 
    */
    return(
      <div
        className={classnames(styles.boxNewlySet)}>
        <div
          className={classnames(styles.comBelongSet)}>
          <div
            className={classnames(styles.boxTitle)}>
            <span
              className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
              {this.props.i18nUIString.catalog["title_BelongSet_"]}</span>
          </div>
          <div>
            <BelongsbyType
              _set_Settingtype={this._set_Settingtype}
              _set_choiceAnType={this._set_choiceAnType}/>
          </div>
        </div>
        {
          (this.props.userInfo.accountStatus == "newly") &&
          <StartBtn/>
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
    belongsByType: state.belongsByType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _fetch_belongRecords: () => {dispatch(fetchBelongRecords())},
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongsSet));
