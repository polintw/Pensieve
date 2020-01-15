import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control
import CreateShare from '../../../../../Component/CreateShare.jsx';
import SvgCreate from '../../../../../Component/Svg/SvgCreate.jsx';
import {
  axios_get_taking_list,
  axios_delete_matchSetting
} from '../../utilsMatchNodes.js';
import {
  handleNounsList,
  setMessageBoolean
} from "../../../../../redux/actions/general.js";
import {
  setFlag,
  setIndexLists,
  setAxiosMatchTaking
} from "../../../../../redux/actions/cosmic.js";
import {
  messageDialogInit
} from "../../../../../redux/constants/globalStates.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';

class Taking extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      demandCount: null,
      takingType: 0,
      onNode: false,
      onGiveUp: false,
      onCreate: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._submit_giveup = this._submit_giveup.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._render_matchTaking = this._render_matchTaking.bind(this);
    this._handleClick_taken_giveUp = this._handleClick_taken_giveUp.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_giveUp = ()=> this.setState((prevState,props)=>{return {onGiveUp: prevState.onGiveUp?false:true}});
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
    this.style={

    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/unit?theater&unitId='+dataObj.unitId);
  }

  _handleClick_taken_giveUp(event){
    event.preventDefault();
    event.stopPropagation();

    if(this.props.axiosMatchTaking || this.state.axios) return; //block if submit something or during GET
    // boolean message to confirm, which in top component, recieving obj as custom setting
    const self = this, //the handler need to pass to the reducer and then the Dialog, the 'this' would be different
          nodeId = this.props.indexLists.demandTake[0];
    let dialogMessage = [ //message for dialog should be in form of array, composed by several obj containing text & style
      {text: this.props.i18nUIString.catalog['message_Main_MatchTakingGiveup'][0], style: {}},
      {text: this.state.demandCount, style: {}},
      {text: ' ', style: {}},
      {text: this.props.i18nUIString.catalog['message_Main_MatchTakingGiveup'][1], style: {}},
      {text: this.props.nounsBasic[nodeId].name, style: {}},
      {text: this.props.i18nUIString.catalog['message_Main_MatchTakingGiveup'][2], style: {}},
    ];

    let messageObj = {
      render: true,
      customButton: "submitting",
      message: dialogMessage,
      handlerPositive: ()=>{self._submit_giveup(nodeId);self.props._set_MessageBoolean(messageDialogInit.boolean);},
      handlerNegative: ()=>{self.props._set_MessageBoolean(messageDialogInit.boolean);} // reset messageBoolean if user regret
    }
    this.props._set_MessageBoolean(messageObj);
  }

  _submit_giveup(nodeId){
    const self = this;
    this.setState({axios: true});
    this.props._set_axios_MatchTaking(true); //set axiosMatchTaking as well

    axios_delete_matchSetting(this.axiosSource.token, 'taking', {'takingList': this.props.indexLists.demandTake})
    .then((resObj)=>{
      self.props._set_axios_MatchTaking(false); //set axiosMatchTaking back
      self._fetch_List(); //if succeed, just refresh the list locally
      //no need to reset local axios, in case the _fetch_List would set it again
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

  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    axios_get_taking_list(this.axiosSource.token)
    .then((resObj)=>{
      //no matter empty or not, update the list of state by the list of res
      self.props._submit_NounsList_new(resObj.main.nodesList); //GET nodes info by Redux action
      self.props._submit_IndexLists({demandTake: resObj.main.nodesList}); //submit the list to the props.indexLists.

      self.setState({
        axios: false,
        demandCount: resObj.main.demandCount,
        takingType: resObj.main.takingType
      })
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
    if(this.props.flagTakingRefresh && this.props.flagTakingRefresh != prevProps.flagTakingRefresh){
      this._fetch_List();
      this.props._submit_FlagSwitch(['flagTakingRefresh']); //set flag back to dafault
    }
  }

  componentDidMount() {
    this._fetch_List();
  }

  componentWillUnmount() {

  }

  _render_matchTaking(){
    let displaying = !this.props.axiosMatchTaking ? (this.props.indexLists.demandTake.length > 0) ? "taking": "empty": "axios";

    switch (displaying) {
      case "taking":
        let nodeId = this.props.indexLists.demandTake[0];
        return (
          <div
            className={classnames(styles.boxWidth)}>
            <div
              className={classnames(styles.boxColum)}>
              <div
                className={classnames(styles.boxColumUp)}>
                <div
                  className={classnames(styles.boxCorner)}>
                  <span
                    className={classnames(stylesMain.fontType)}
                    style={{color: '#ff7a5f'}}>
                    {
                      (this.state.takingType== 1) ?
                      this.props.i18nUIString.catalog["title_Main_matchTaking"][0]:
                      this.props.i18nUIString.catalog["title_Main_matchTaking"][3]
                    }
                  </span>
                  <Link
                    to={"/nodes/"+nodeId}
                    className={classnames('plainLinkButton', styles.boxNodeName)}
                    onMouseEnter={this._handleMouseOn_Node}
                    onMouseLeave={this._handleMouseOn_Node}>
                    {
                      this.state.onNode &&
                      <span style={{
                          width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                          borderBottom: 'solid 1px #ff7a5f'
                        }}/>
                      }
                      <span
                        className={classnames(stylesMain.fontCorner)}>
                        {nodeId in this.props.nounsBasic ? (
                          this.props.nounsBasic[nodeId].name) : (null)}
                        </span>
                      </Link>
                </div>
                <div
                  className={classnames(styles.boxAssist)}>
                  <span
                    className={classnames(stylesMain.fontTitle)}
                    style={{color: 'rgb(64, 133, 160)', fontWeight: '700'}}>
                    {this.state.demandCount}
                  </span>
                  <span
                    className={classnames(stylesMain.fontType)}>
                    {this.props.i18nUIString.catalog["title_Main_matchTaking"][1]}</span>
                </div>
              </div>
              <div
                className={classnames(styles.boxfoot)}>
                <div
                  className={classnames(styles.boxCreate)}
                  onMouseEnter={this._handleMouseOn_Create}
                  onMouseLeave={this._handleMouseOn_Create}>
                  <SvgCreate
                    black={this.state.onCreate}
                    place={false}
                    stretch={false}/>
                  <CreateShare
                    _submit_Share_New={this._submit_Share_New}
                    _refer_von_Create={this.props._refer_von_cosmic}/>
                </div>
                <div
                  className={classnames(styles.boxGiveUp, stylesMain.fontSubmit)}
                  style={this.state.onGiveUp? {textShadow: '0 0 4px hsla(0, 0%, 68%, 0.88)'}:{}}
                  onMouseEnter={this._handleMouseOn_giveUp}
                  onMouseLeave={this._handleMouseOn_giveUp}
                  onClick={this._handleClick_taken_giveUp}>
                  <span>
                    {this.props.i18nUIString.catalog["title_Main_matchTaking"][2][0]}
                  </span>
                  <span>
                    {this.props.i18nUIString.catalog["title_Main_matchTaking"][2][1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case "axios":
        return (
          <div
            className={classnames(styles.boxWidth, stylesMain.fontType)}>
            {this.props.i18nUIString.catalog["hint_Process_MatchTaking"]}
          </div>
        )
        break;
      default:
        return null //like the 'empty list' situation
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comTaking)}>
        {this._render_matchTaking()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    nounsBasic: state.nounsBasic,
    i18nUIString: state.i18nUIString,
    flagTakingRefresh: state.flagTakingRefresh,
    axiosMatchTaking: state.axiosMatchTaking,
    indexLists: state.indexLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
    _set_axios_MatchTaking: () => { dispatch(setAxiosMatchTaking()); },
    _set_MessageBoolean: (obj) => { dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Taking));
