import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BelongOptions from '../BelongOptions/BelongOptions.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../redux/actions/general.js";

const recordLink = (nodeId, self)=>{
  //still check if the node has data in reducer
  return (
    <Link
      key={"key_Belong_records_"+nodeId}
      to={"/nodes/"+nodeId}
      nodeid={nodeId}
      className={classnames('plainLinkButton', styles.boxRecord)}
      onMouseEnter={self._handleEnter_Record}
      onMouseLeave={self._handleLeave_Record}>
      <div
        className={classnames(styles.spanRecord)}>
        {
          (self.state.onRecord== nodeId) &&
          <span style={{
              width: '72%', position: 'absolute', bottom: '-11%', left: '5%',
              borderBottom: 'solid 1px #ff7a5f'
            }}/>
          }
        {nodeId in self.props.nounsBasic ? (
          self.props.nounsBasic[nodeId].name) : (
            null
          )}
      </div>
    </Link>
  )
}

class BelongForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      records: false, //would be an array after the axios get the records from db
      viewForm: false, //judge whether open the Options or not
      onReturn: false,
      onRecord: false,
      onSubDescrip: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_refresh = this._set_refresh.bind(this);
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_actionDescrip = this._render_actionDescrip.bind(this);
    this._handleClick_editBelong = this._handleClick_editBelong.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._handleEnter_Record = this._handleEnter_Record.bind(this);
    this._handleLeave_Record = this._handleLeave_Record.bind(this);
    this._handleMouseOn_formReturn = ()=> this.setState((prevState,props)=>{return {onReturn: prevState.onReturn?false:true}});
    this._handleMouseOn_SubDescrip = ()=> this.setState((prevState,props)=>{return {onSubDescrip: prevState.onSubDescrip?false:true}});
    this._set_stateViewForm = ()=>{
      this.setState((prevState, index)=>{return {viewForm: prevState.viewForm ? false: true};}); };
    this.style={

    }
  }

  _handleEnter_Record(e){
    this.setState({
      onRecord: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_Record(e){
    this.setState({
      onRecord: false
    })
  }

  _axios_GET_belongRecords(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/profile/sheetsNodes?present&random&limit=5',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      let resObj = JSON.parse(res.data);
      self.props._submit_NounsList_new(resObj.main.nodesList);

      self.setState((prevState, props)=>{
        return({
          axios: false,
          records: resObj.main.nodesList.length> 0 ? resObj.main.nodesList : true,
          //check if the nodesList has anything. if not, return true to let the com rendered(default 'false')
          viewForm: resObj.main.nodesList.length> 0 ? false : true
          //if nothing, means need to show the ptions Form, set it to 'true'
        });
        //for now, we didn't update nodes connection to user to anywhere
        //even it was already prepared by res data
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
  }

  _handleClick_editBelong(e){
    e.preventDefault();
    e.stopPropagation();
    this._handleMouseOn_SubDescrip(); //just to mimic the mouse leave to reset the state
    this._set_stateViewForm();
  }

  _set_refresh(){
    //called to refresh the whole data display
    //used when submit new one, or cancel the edit
    this.setState((prevState, props)=>{
      return {
        records: false,
        viewForm: false
      }
    }, ()=>{
      this._axios_GET_belongRecords();
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._axios_GET_belongRecords();
  }

  componentWillUnmount() {

  }

  _render_actionDescrip(){
    //currently focus on 2 confitions: no records at all( <1), or less than 3
    if(this.state.viewForm){
      return (
        <div
          style={{padding: '5px 2%'}}>
          <p
            className={classnames(styles.pDescrip, styles.fontDescripTitle)}>
            {this.props.i18nUIString.catalog['guidingNewBelong']}</p>
          {(this.state.records.length>0) &&
            <span
              className={classnames(styles.spanReturn, styles.fontReturn)}
              style={this.state.onReturn? {color: 'rgb(160,160,160)'}:{}}
              onClick={this._set_stateViewForm}
              onMouseEnter={this._handleMouseOn_formReturn}
              onMouseLeave={this._handleMouseOn_formReturn}>
              {" ← "}</span>}
        </div>
      );}
    else if(this.state.records.length< 3){ //has records, but not all set
      //due to property 'flex', <p> should be put inside a div first to avoid unnecessary stretch
      return (
        <div>
          <p
            className={classnames(styles.pDescrip, styles.fontDescripSubTitle)}
            style={{cursor: 'pointer', color: this.state.onSubDescrip? "#000000": "#aeaeae"}}
            onClick={this._handleClick_editBelong}
            onMouseEnter={this._handleMouseOn_SubDescrip}
            onMouseLeave={this._handleMouseOn_SubDescrip}>
            {this.props.i18nUIString.catalog['guidingEditBelong']}</p>
        </div>
      );}
    else if(this.state.records.length> 2){ //records all set, display 'edit'  in the future
      //due to property 'flex', <p> should be put inside a div first to avoid unnecessary stretch
      return (
        <div>
          <p
            className={classnames(styles.pDescrip, styles.fontDescripSubTitle)}
            style={{cursor: 'pointer', color: this.state.onSubDescrip? "#000000": "#aeaeae"}}
            onClick={this._handleClick_editBelong}
            onMouseEnter={this._handleMouseOn_SubDescrip}
            onMouseLeave={this._handleMouseOn_SubDescrip}>
            {this.props.i18nUIString.catalog['guidingEditBelong']}</p>
        </div>
      );}
    else{ //in case true/false at init state, mainly meaning there is not any records
      return (
        <p
          className={classnames(styles.pDescrip, styles.fontDescripTitle)}>
          {this.props.i18nUIString.catalog['guidingNewBelong']}</p>)
    }
  }

  _render_BelongList(){
    let items = this.state.records.map((nodeId, index)=>{
      return recordLink(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongForm)}>
        {
          !this.state.viewForm && this.state.records &&
          <div
            className={classnames(styles.boxList, styles.fontList)}>
            {this._render_BelongList()}
          </div>
        }
        {
          this.state.records &&
          <div
            className={classnames(styles.boxPanel)}>
            {this._render_actionDescrip()}
            {
              this.state.viewForm &&
              <BelongOptions
                _set_refresh={this._set_refresh}/>
            }
          </div>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongForm));
