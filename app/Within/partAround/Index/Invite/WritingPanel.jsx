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
      resMessage: {},
      onButton: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_FormBelong = this._render_FormBelong.bind(this);
    this._render_FormUnrelated = this._render_FormUnrelated.bind(this);
    this._handleSubmit_ = this._handleSubmit_.bind(this);
    this._handleChange_InputRadio = this._handleChange_InputRadio.bind(this);
    this._handleClick_inviteComplete = this._handleClick_inviteComplete.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
    this._axios_PATCH_Invitation = this._axios_PATCH_Invitation.bind(this);
    this._axios_GET_InvitingLink = this._axios_GET_InvitingLink.bind(this);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_FormBelong(){
    if( !("homeland" in this.props.belongsByType) && !("residence" in this.props.belongsByType)){
      return (
        <div
          className={classnames(styles.boxOption)}>
          <span
            className={classnames('fontSubtitle_h5', 'colorGrey')}>
            {this.props.i18nUIString.catalog['guiding_Invite_'][0]}</span>
        </div>
      )
    };
    return (
      <form onSubmit={this._handleSubmit_}>
        <div
          className={classnames(styles.boxFormOptions)}>
          {
            (("homeland" in this.props.belongsByType) && !!this.props.belongsByType["homeland"]) &&
            <div
              className={classnames(styles.boxOption)}>
              <input
                type="radio"
                name="belong"
                value= {"homeland"}
                checked={this.state.belong == "homeland"}
                onChange={this._handleChange_InputRadio}
                className={classnames(styles.inputOptBelong)}
                required/>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}>
                {this.props.belongsByType["homeland"] in this.props.nounsBasic ? (
                  this.props.nounsBasic[this.props.belongsByType["homeland"]].name) : (
                    null
                  )}
              </span>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}
                style={{marginLeft: '0'}}>
                {this.props.i18nUIString.catalog["descript_Invite_optType"][0]}
              </span>
            </div>
          }
          {
            (("residence" in this.props.belongsByType) && !!this.props.belongsByType["residence"]) &&
            <div
              className={classnames(styles.boxOption)}>
              <input
                type="radio"
                name="belong"
                value= {"residence"}
                checked={this.state.belong == "residence"}
                onChange={this._handleChange_InputRadio}
                className={classnames(styles.inputOptBelong)}
                required/>
                <span
                  className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}>
                  {this.props.belongsByType["residence"] in this.props.nounsBasic ? (
                    this.props.nounsBasic[this.props.belongsByType["residence"]].name) : (
                      null
                    )}
                </span>
                <span
                  className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}
                  style={{marginLeft: '0'}}>
                  {this.props.i18nUIString.catalog["descript_Invite_optType"][1]}
                </span>
            </div>
          }
        </div>
        <div
          className={classnames(styles.boxFormGenerate)}>
          <div
            className={classnames(styles.boxWarning)}>
            <span
              className={classnames(
                "fontSubtitle_h5",
                "colorEditBlack"
              )}>
              {this.state.resMessage.warning}
            </span>
          </div>
          <input
            type='submit'
            value="Get Link!"
            disabled={this.state.axios}
            className={classnames(
              'plainInput',
              styles.inputSubmit, 'fontSubtitle_h5', 'colorWhite'
            )}
            style={
              Object.assign({}, (this.state.belong.length > 0) ? {
                backgroundColor: (this.state.onButton=="Get Link!")?  "#ff8168" : '#4587A0',
                cursor: "pointer"
              }: {  backgroundColor: "#d8d8d8" /* inactive status*/, cursor: "default"})
            }
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}/>
        </div>
      </form>
    )
  }

  _render_FormUnrelated(){
    return (
      <form onSubmit={this._handleSubmit_}>
        <div
          className={classnames(styles.boxFormOptions)}>
          <div
            className={classnames(styles.boxOption)}>
            <input
              type="radio"
              name="unrelated"
              value= {"homeland"}
              checked={this.state.belong == "homeland"}
              onChange={this._handleChange_InputRadio}
              className={classnames(styles.inputOptBelong)}
              required/>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}>
                {this.props.reqNode in this.props.nounsBasic ? (
                  this.props.nounsBasic[this.props.reqNode].name) : (
                    null
                  )}
              </span>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}
                style={{marginLeft: '0'}}>
                {this.props.i18nUIString.catalog["descript_Invite_optType"][0]}
              </span>
          </div>
          <div
            className={classnames(styles.boxOption)}>
            <input
              type="radio"
              name="unrelated"
              value= {"residence"}
              checked={this.state.belong == "residence"}
              onChange={this._handleChange_InputRadio}
              className={classnames(styles.inputOptBelong)}
              required/>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}>
                {this.props.reqNode in this.props.nounsBasic ? (
                  this.props.nounsBasic[this.props.reqNode].name) : (
                    null
                  )}
              </span>
              <span
                className={classnames(styles.spanInputTag, "colorOptionsBlack", "fontSubtitle_h5")}
                style={{marginLeft: '0'}}>
                {this.props.i18nUIString.catalog["descript_Invite_optType"][1]}
              </span>
          </div>

        </div>
        <div
          className={classnames(styles.boxFormGenerate)}>
          <div
            className={classnames(styles.boxWarning)}>
            <span
              className={classnames(
                "fontSubtitle_h5",
                "colorEditBlack"
              )}>
              {this.state.resMessage.warning}
            </span>
          </div>
          <input
            type='submit'
            value="Get Link!"
            disabled={this.state.axios}
            className={classnames(
              'plainInput',
              styles.inputSubmit, 'fontSubtitle_h5', 'colorWhite'
            )}
            style={
              Object.assign({}, (this.state.belong.length > 0) ? {
                backgroundColor: (this.state.onButton=="Get Link!")?  "#ff8168" : '#4587A0',
                cursor: "pointer"
              }: {  backgroundColor: "#d8d8d8" /* inactive status*/, cursor: "default"})
            }
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}/>
        </div>
      </form>
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.comWritingPanel)}>
        <div
          className={classnames(styles.boxSection)}>
          <span
            className={classnames('fontTitle', 'colorStandard')}>
            {this.props.i18nUIString.catalog["title_Invite_"]}
          </span>
        </div>
        <div
          className={classnames(styles.boxSection)}>
          <span
            className={classnames('fontSubtitle_h5', 'colorOptionsBlack')}>
            {this.props.i18nUIString.catalog["descript_Invite_"][2]}
          </span>
          <span
            className={classnames('fontSubtitle_h5', 'colorOptionsBlack')}>
            {this.props.i18nUIString.catalog["descript_Invite_"][1]}
          </span>
        </div>
        <div style={{ width: '100%', marginBottom: '2rem', borderTop: "solid 0.75px #979797"}}/>
        <div
          className={classnames(styles.boxSection)}
          style={{margin: '0 0 3rem'}}>
          <div
            className={classnames(styles.boxTitleForm)}>
            <span
              className={classnames('fontSubtitle_h5', 'colorDescripBlack')}>
              {
                this.props.i18nUIString.catalog["guiding_Invite_"][this.props.belongOnly ? 0: 2]
              }
              </span>
          </div>
          {
            this.props.belongOnly ?
            this._render_FormBelong(): this._render_FormUnrelated()}

        </div>
        <div
          className={classnames(styles.boxCopyOneLine, styles.boxSection)}>
          <CopyOneLine
            inputString={this.state.invitingLink}/>
        </div>
        <div>
          <div
            value="complete"
            className={classnames(styles.inputSubmit)}
            style={Object.assign({},
              (this.state.onButton=="complete")? {backgroundColor: "#4587A0"}: {}
            )}
            onClick={this._handleClick_inviteComplete}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(
                'centerAlignChild', 'fontSubtitle_h5',
                {
                  ['colorWhite']: this.state.onButton=="complete",
                  ['colorOptionsBlack']: this.state.onButton!="complete"
                }
              )}>
              {this.props.i18nUIString.catalog["button_complete"]}
            </span>
          </div>
        </div>

      </div>
    )
  }

  _axios_PATCH_Invitation(belongType, reqNode){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'patch',
      url: '/router/invite/fellows',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token,
      data: {
        belongType: belongType,
        reqNode: reqNode
      }
    }).then(function (res) {
      // not going to reset axios state, on the view the next step would start immediately. self.setState({ axios: false });
      let resObj = JSON.parse(res.data);

      self._axios_GET_InvitingLink(belongType, reqNode);
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

  _axios_GET_InvitingLink(belongType, reqNode) {
    const self = this;
    this.setState({ axios: true });

    axios({
      method: 'get',
      url: '/router/invite/fellows',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token,
      params: {belongType: belongType, reqNode: reqNode},
    })
    .then(function (res) {
      let resObj = JSON.parse(res.data);

      self.setState({
        axios: false,
        invitingLink: resObj.main.invitingLink,
        resMessage: resObj.main.message
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
    let belongType = !!this.props.belongOnly ? this.state.belong: "unrelated";
    let reqNode = !!this.props.reqNode ? this.props.reqNode : this.props.belongsByType[belongType]; // node going to req, took from belongsByType if not "unrelated"
    this._axios_PATCH_Invitation(belongType, reqNode);
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

  _handleEnter_button(e){
    this.setState({
      onButton: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
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
