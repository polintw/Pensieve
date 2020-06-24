import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../Components/AccountPalette.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';
import {
  updateUsersBasic,
  updateNodesBasic,
  setMessageSingle
} from "../../redux/actions/general.js";
import {
  messageDialogInit} from "../../redux/states/constants.js";
import {
    cancelErr,
    uncertainErr
} from "../../utils/errHandlers.js";

class InvitationFellow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        axios: false,
        sender: null,
        node: null,
        belongType: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Invitation = this._render_Invitation.bind(this);
    this._render_textTypeConnectin = this._render_textTypeConnectin.bind(this);
    this._axios_GET_InvitationFellow = this._axios_GET_InvitationFellow.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(
      (this.props.tokenStatus == 'verified') &&
      ("valid" in this.state) &&
      (this.state.sender in this.props.usersBasic) &&
      // Important! need to check prevProps to stop loop
      prevProps.messageSingle['render'] == this.props.messageSingle['render'] &&
      !this.props.messageSingle['render']
    ){
      let message = this.state.valid ? ([
        {
          text: this.props.usersBasic[this.state.sender].firstName+" ",
          style:{}
        },
        {
          text: this.props.usersBasic[this.state.sender].lastName+" ",
          style:{}
        },
        {text:this.props.i18nUIString.catalog['message_Invite_validToken'][0],style:{}},
        {text:
          this.state.node in this.props.nounsBasic ? (
            this.props.nounsBasic[this.state.node].name) : (
              null
            ) ,style:{}},
        {text:this.props.i18nUIString.catalog['message_Invite_validToken'][1],style:{}}
      ]): ([
        {text:this.props.i18nUIString.catalog['message_Invite_General'],style:{}}
      ]);

      this.props._submit_SingleDialog({
        render: true,
        message: message,
        handlerPositive: ()=>{
          // first!! reset the dialog state to init
          this.props._submit_SingleDialog(messageDialogInit.single);
          this.props.history.push({ // back to index
            pathname: this.props.match.path,
            search: '',
            state: {from: this.props.location}
          }); return;},
        buttonValue: 'Okay'
      });
    };
  }

  componentDidMount() {
    const self = this;
    this.setState({ axios: true });

    this._axios_GET_InvitationFellow()
    .then((resObj)=>{
      //here, without token, the info for user & node have been already res together,
      //and we process them still like we do for any user & node display
      let nodeBasicObj = {},
          userBasicObj = {};
      nodeBasicObj[resObj.main.nodeBasic.id] = resObj.main.nodeBasic;
      userBasicObj[resObj.main.userBasic.id] = resObj.main.userBasic;
      self.props._submit_Nodes_insert(nodeBasicObj);
      self.props._submit_Users_insert(userBasicObj);

      self.setState({
        axios: false,
        valid: true,
        sender: resObj.main.userBasic.id,
        node: resObj.main.nodeBasic.id,
        belongType: resObj.main.belongType
      });

    })
    .catch(function(thrown) {
      self.setState({ axios: false });
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        if(!!thrown.response ){ // special management for this comp. show general content if nothing special
          self.setState({
            valid: false
          });
          return; //catch() has been handle
        };
        let message = uncertainErr(thrown);
        if (message) alert(message);
      }
    });
  }

  componentWillUnmount() {

  }

  _render_textTypeConnectin(){
    switch (this.state.belongType) {
      case "unrelated":
        return this.props.i18nUIString.catalog["message_Invite_fellows"][9]
        break;
      case "homeland":
        return this.props.i18nUIString.catalog["message_Invite_fellows"][2]
        break;
      case "residence":
        return this.props.i18nUIString.catalog["message_Invite_fellows"][3]
        break;
      default:
        return null
    }
  }

  _render_Invitation(){
    if(!("valid" in this.state) ){ //at first load, should be 'empty' waiting for res
      return null
    };
    return (this.state.valid) ? (
      <div
        className={classnames(styles.comInvitation)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames("fontTitle", "colorStandard")}>
            {this.props.i18nUIString.catalog["title_Invitation_"]}
          </span>
          <span
            className={classnames("fontContent", "colorEditBlack", "fontStyleItalic")}
            style={{display: 'inline-block', marginLeft: '1rem'}}>
            {this.props.i18nUIString.catalog["message_Invite_fellows"][8]}
            <AccountPalette
              size={'regular'}
              styleFirst={{fontWeight: '400'}}
              userId={this.state.sender}/>
          </span>
        </div>
        <p
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][0]}
          <AccountPalette
            size={'regular'}
            styleFirst={{fontWeight: '400'}}
            userId={this.state.sender}/>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][5]}
        </p>
        <p
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][1]}
          {this._render_textTypeConnectin()}
        </p>
        <p
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          <span
            className={classnames("fontSubtitle_h5", "colorSignBlack", "weightBold")}>
            {this.state.node in this.props.nounsBasic ? (
              this.props.nounsBasic[this.state.node].name) : (
                null
              )}
          </span>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][6]}
        </p>
        <p
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][4]}
          <br/>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][7]}
        </p>
      </div>
    ):(
      <div
        className={classnames(styles.comInvitation)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames("fontTitle", "colorStandard")}>
            {this.props.i18nUIString.catalog["title_Invitation_"]}
          </span>
        </div>
        <p
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_General"]}</p>
      </div>
    )
  }

  render(){
    if (this.props.tokenStatus == 'verified' ) return null
    else {
      return(
        <div>
          {
            this._render_Invitation()
          }
        </div>
      )
    };
  }

  _axios_GET_InvitationFellow() {
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let invitationKey = !!params.get('invitation') ? params.get('invitation') : false;
    if(!invitationKey) {alert('You do not have the invitation.');return;};

    return axios({
      method: 'get',
      url: '/router/general/invitation/fellows',
      headers: {
        'charset': 'utf-8'
      },
      cancelToken: this.axiosSource.token,
      params: { invitingKey: invitationKey },
    })
    .then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    messageSingle: state.messageSingle,
    usersBasic: state.usersBasic,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_Users_insert: (obj) => { dispatch(updateUsersBasic(obj)); },
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_SingleDialog: (obj)=>{dispatch(setMessageSingle(obj));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitationFellow);
