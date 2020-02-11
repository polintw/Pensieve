import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control
import BelongOptions from '../BelongOptions/BelongOptions.jsx';
import {
  _axios_GET_sharedCount,
  _axios_GET_usersCount
} from '../utils.js';

const staticsRoles = ["resident", "visitors", "homesick"]

class BelongbyType extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false,
      roleUsersCount: {},
    };
    this._set_infoCount = this._set_infoCount.bind(this);
    this._render_type = this._render_type.bind(this);
    this._render_statics = this._render_statics.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_belongSetting = this._handleClick_belongSetting.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_Type = ()=> this.setState((prevState,props)=>{return {onType: prevState.onType?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
  }

  _handleClick_belongSetting(event){
    event.preventDefault();
    event.stopPropagation();

    this._set_settingModal();
  }

  _set_infoCount(typeObj){
/*
for mockup use during test period
*/
    let fakedCount = [[7, 19], [21, 14], [3, 10]];
    let countObj = {};
    staticsRoles.forEach((role, index)=>{
      countObj[role] = (this.props.listIndex ==1) ? fakedCount[index][1]: fakedCount[index][0];
    });
    this.setState({
      roleUsersCount: countObj
    })
/*
above, is silent statics for mockup.
below are the real method needed, but Notice!
it need some necessary modification.

    let promiseArr = staticsRoles.map((key, index)=>{
      return this._axios_GET_usersCount(this.axiosSource.cancelToken, nodeId, type);
    });

    const self = this;
    this.setState({axios: true});

    axios.all(promiseArr)
      .then(results => { //we don't know how many res from .all(), so use general params
        self.setState({axios: false});

        let nodesTypeCount = {}; //obj prepare for new records, combined with current state later
        //we then loop the results, and by the same order, we pick the nodeId from nodesList by index
        //and remember, the result hasn't parse yet
        results.forEach((res, index)=>{
          let resObj = JSON.parse(res.data);
          nodesTypeCount[typeKeys[index]] = resObj.main.count;
        });

        self.setState((prevState, props)=>{
          return {
            nodesTypeCount: {...prevState.nodesTypeCount, ...nodesTypeCount} //combined new records to current state by spread
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
*/
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._set_infoCount();

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    //determine the id of current node
    const nodeId = this.props.typeObj[this.props.type];

    return (
      <Link
        to={"/cosmic/nodes/"+nodeId}
        className={classnames('plainLinkButton', styles.boxNode)}
        onMouseEnter={this._handleMouseOn_Node}
        onMouseLeave={this._handleMouseOn_Node}>
        <div
          className={classnames(styles.spanNode, stylesMain.fontCorner)}>
          {
            this.state.onNode &&
            <span style={{
                width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                borderBottom: 'solid 1px #ff7a5f'
              }}/>
          }
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
          </div>
        </Link>
    )
  }

  _render_type(){
    return (
      <div
        title={this.props.i18nUIString.catalog["descript_BelongTypeInteract"][0]+this.props.type+this.props.i18nUIString.catalog["descript_BelongTypeInteract"][1]}
        className={classnames(styles.boxTitleType)}
        onMouseEnter={this._handleMouseOn_Type}
        onMouseLeave={this._handleMouseOn_Type}
        onClick={this._handleClick_belongSetting}>
        <span
          className={classnames(
            styles.spanType,
            stylesMain.fontType,
            {[styles.fontOnType]: this.state.onType}
          )}
          style={{lineHeight: '3rem'}}>
          {this.props.type}</span>
      </div>
    )
  }

  _render_statics(){
    let staticsDOM = staticsRoles.map((role, index)=>{
      return (
        <div
          key={"key_cornersStatics_role_"+role}
          className={classnames(styles.boxCount)}>
          <div style={{display: 'inline-flex', flexDirection: 'column'}}>
            <span
              className={classnames(styles.spanType, stylesMain.fontType)}>
              {role}
            </span>
          </div>
          <span
            className={classnames(styles.spanType, styles.fontCount)}>
            {
              this.state.roleUsersCount[role]
            }
          </span>
        </div>
      )
    })

    return staticsDOM;
  }

  render(){

    return(
      <div
        className={classnames(styles.comBelongByType)}>
        {
          this.state.settingModal &&
          <div
            className={classnames(styles.boxSettingModal)}>
            <BelongOptions
              {...this.props}
              _set_settingModal={this._set_settingModal}/>
          </div>
        }
        <div
          className={classnames(styles.boxCornerTitle)}>
          {
            ( !this.state.settingModal) &&
            this._render_nodeLink()
          }
          {this._render_type()}
        </div>
        <div
          className={classnames(styles.boxStatics)}>
          {this._render_statics()}
        </div>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongbyType));
