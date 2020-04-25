import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CopyOneLine from '../../../../Components/CopyOneLine.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class WritingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      belong: '',
      invitingLink: null,
      resMessage: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Form = this._render_Form.bind(this);
    this._handleSubmit_ = this._handleSubmit_.bind(this);
    this._handleChange_InputRadio = this._handleChange_InputRadio.bind(this);
    this._handleClick_inviteComplete = this._handleClick_inviteComplete.bind(this);
    this._axios_PATCH_Invitation = this._axios_PATCH_Invitation.bind(this);
    this._axios_GET_InvitingLink = this._axios_GET_InvitingLink.bind(this);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Form(){
    if( !("homeland" in this.props.belongsByType) && !("residence" in this.props.belongsByType)){
      return (
        <div>
          <span>{this.props.i18nUIString.catalog['guiding_Invite_'][0]}</span>
        </div>
      )
    };
    return (
      <form onSubmit={this._handleSubmit_}>
        <div>
          {
            !!("homeland" in this.props.belongsByType) &&
            <div>
              <input
                type="radio"
                name="belong"
                value= {"homeland"}
                checked={this.state.belong == "homeland"}
                onChange={this._handleChange_InputRadio}
                required/>
              <span>
                {this.props.belongsByType["homeland"] in this.props.nounsBasic ? (
                  this.props.nounsBasic[this.props.belongsByType["homeland"]].name) : (
                    null
                  )}
              </span>
            </div>
          }
          {
            !!("residence" in this.props.belongsByType) &&
            <div>
              <input
                type="radio"
                name="belong"
                value= {"residence"}
                checked={this.state.belong == "residence"}
                onChange={this._handleChange_InputRadio}
                required/>
              <span>
                {this.props.belongsByType["residence"] in this.props.nounsBasic ? (
                  this.props.nounsBasic[this.props.belongsByType["residence"]].name) : (
                    null
                  )}
              </span>
            </div>
          }
        </div>
        <div>
          {
            ( this.state.resMessage.warning) &&
            <div>
              {this.state.resMessage.warning}
            </div>
          }
          <input
            type='submit'
            value="Generate"
            disabled={this.state.axios}/>
        </div>
      </form>
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.comWritingPanel)}>
        <div>
          <span>
            {this.props.i18nUIString.catalog["descript_Invite_"][0]}
          </span>
          <span>
            {this.props.i18nUIString.catalog["descript_Invite_"][1]}
          </span>
        </div>
        <div>
          <div>
            <span>{this.props.i18nUIString.catalog["guiding_Invite_"][0]}</span>
          </div>
          {this._render_Form()}
        </div>
        <div>
          <CopyOneLine
            inputString={this.state.invitingLink}/>
        </div>
        <div>
          <div
            onClick={this._handleClick_inviteComplete}>
            <span>
              {this.props.i18nUIString.catalog["button_complete"]}
            </span>
          </div>
        </div>

      </div>
    )
  }

  _axios_PATCH_Invitation(belongType){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'patch',
      url: '/router/invitation/fellows',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token,
      data: {belongType: belongType}
    }).then(function (res) {
      // not going to reset axios state, on the view the next step would start immediately. self.setState({ axios: false });
      let resObj = JSON.parse(res.data);

      self._axios_GET_InvitingLink(belongType);
    })
    .catch(function (thrown) {
      self.setState({ axios: false });
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);

        if (message) self.setState({ resMessage: message });
      }
    });
  }

  _axios_GET_InvitingLink(belongType) {
    const self = this;
    this.setState({ axios: true });

    axios({
      method: 'get',
      url: '/router/invitation/fellows',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token,
      params: {belongType: belongType},
    })
    .then(function (res) {
      let resObj = JSON.parse(res.data);

      self.setState({
        axios: false,
        invitingLink: resObj.main.invitingLink
      });
    })
    .catch(function (thrown) {
      self.setState({ axios: false });
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);

        if (message) self.setState({ resMessage: message });
      }
    });
  }


  _handleSubmit_(event){
    event.preventDefault(); //prevent default form submit behavior
    this._axios_PATCH_Invitation(this.state.belong);
  }

  _handleChange_InputRadio(event) {
    this.setState({
      belong: event.target.value
    });
  }

  _handleClick_inviteComplete(event){
    event.preventDefault();
    event.stopPropagation();
    this.props.onComplete();
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(WritingPanel));
