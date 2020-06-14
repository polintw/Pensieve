import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../Components/AccountPalette.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';
import {
  updateUsersBasic,
  updateNodesBasic,
} from "../../redux/actions/general.js";
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
    this._axios_GET_InvitationFellow = this._axios_GET_InvitationFellow.bind(this);
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

  _render_Invitation(){
    if(!("valid" in this.state) ){ //at first load, should be 'empty' waiting for res
      return null
    };
    return (this.state.valid) ? (
      <div
        className={classnames(styles.comInvitation)}>
        <div>
          <span
            className={classnames("fontTitle", "colorStandard")}>
            {this.props.i18nUIString.catalog["title_Invitation_"]}
          </span>
        </div>
        <p
          className={classnames("fontContent", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][0]}
          <AccountPalette
            size={'regular'}
            styleFirst={{fontWeight: '400'}}
            userId={this.state.sender}/>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][5]}
        </p>
        <p
          className={classnames("fontContent", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][1]}
        </p>
        <p
          className={classnames("fontContent", "colorSignBlack")}>
          {
            this.state.belongType =="homeland" ? (
              this.props.i18nUIString.catalog["message_Invite_fellows"][2]
            ):(
              this.props.i18nUIString.catalog["message_Invite_fellows"][3]
            )
          }
          <span
            className={classnames("fontContent", "colorSignBlack", "weightBold")}>
            {this.state.node in this.props.nounsBasic ? (
              this.props.nounsBasic[this.state.node].name) : (
                null
              )}
          </span>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][6]}
        </p>
        <p
          className={classnames("fontContent", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][4]}</p>
        <p
          className={classnames("fontContent", "colorSignBlack")}>
          {this.props.i18nUIString.catalog["message_Invite_fellows"][7]}</p>

      </div>
    ):(
      <div
        className={classnames(styles.comInvitation)}>
        <div>
          <span
            className={classnames("fontTitle", "colorStandard")}>
            {this.props.i18nUIString.catalog["title_Invitation_"]}
          </span>
        </div>
        <div>
          <p>{this.props.i18nUIString.catalog["message_Invite_General"]}</p>
        </div>
      </div>
    )
  }

  render(){
    return(
      <div>
        {
          this._render_Invitation()
        }
      </div>
    )
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
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_Users_insert: (obj) => { dispatch(updateUsersBasic(obj)); },
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitationFellow);
