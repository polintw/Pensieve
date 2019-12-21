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
import {
  setFlag
} from "../../../redux/actions/cosmic.js";

class BelongForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      records: false, //would be an array after the axios get the records from db
      inOptions: false, //judge whether open the Options or not
      onReturn: false,
      onGreet: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_refresh = this._set_refresh.bind(this);
    this._render_titleGreet = this._render_titleGreet.bind(this);
    this._render_titleOptions = this._render_titleOptions.bind(this);
    this._handleClick_editBelong = this._handleClick_editBelong.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._handleMouseOn_formReturn = ()=> this.setState((prevState,props)=>{return {onReturn: prevState.onReturn?false:true}});
    this._handleMouseOn_SubDescrip = ()=> this.setState((prevState,props)=>{return {onGreet: prevState.onGreet?false:true}});
    this._set_stateInOptions = ()=>{
      this.setState((prevState, index)=>{return {inOptions: prevState.inOptions ? false: true};}); };
    this.style={

    }
  }

  _handleClick_editBelong(e){
    e.preventDefault();
    e.stopPropagation();
    this._handleMouseOn_SubDescrip(); //just to mimic the mouse leave to reset the state
    this._set_stateInOptions();
  }

  _set_refresh(){
    //called to refresh the whole data display
    //used when submit new one, or cancel the edit
    this.setState((prevState, props)=>{
      return {
        records: false,
        inOptions: false
      }
    }, ()=>{
      //use fetchFlags to refresh data set to render new setting
      self.props._submit_FlagSwitch(['flagBelongRefresh']);
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
      //in this component, we didn't really need to render the nodes from the list
      //we just want to check the 'length'
      self.setState((prevState, props)=>{
        return({
          axios: false,
          records:  resObj.main.nodesList, //default 'false', return list just for the com to depend
          inOptions: resObj.main.nodesList.length> 0 ? false : true //if nothing, means need to show the options Form, set it to 'true'
        });
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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._axios_GET_belongRecords();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_titleOptions(){
    if(this.state.records.length < 3){
      return (
        <p
          className={classnames(styles.pDescrip, styles.fontDescripTitle)}>
          {this.props.i18nUIString.catalog['guidingBelong_NewSet']}</p>
      );
    }
    else //already enough records, so should display a 'change mind 'question here
    return (
      <p
        className={classnames(styles.pDescrip, styles.fontDescripTitle)}>
        {this.props.i18nUIString.catalog['guidingBelong_EditReset']}</p>
    ); //end of 'if'
  }

  _render_titleGreet(){
    if(this.state.records.length< 3){ //records not all set
      //due to property 'flex', <p> should be put inside a div first to avoid unnecessary stretch
      return (
        <p
          className={classnames(styles.pDescrip, styles.fontTitleGreet)}
          style={{cursor: 'pointer', color: this.state.onGreet? "#000000": "#aeaeae"}}
          onClick={this._handleClick_editBelong}
          onMouseEnter={this._handleMouseOn_SubDescrip}
          onMouseLeave={this._handleMouseOn_SubDescrip}>
          {this.props.i18nUIString.catalog['guidingBelong_New']}</p>
      );}
    else{ //belong records are all set, switch between greet
      return this.state.onGreet ? (
        <p
          className={classnames(styles.pDescrip, styles.fontTitleGreet)}
          style={{cursor: 'pointer', color: "#000000"}}
          onClick={this._handleClick_editBelong}
          onMouseEnter={this._handleMouseOn_SubDescrip}
          onMouseLeave={this._handleMouseOn_SubDescrip}>
          {this.props.i18nUIString.catalog['guidingBelong_Edit']}</p>
      ): (
        <p
          className={classnames(styles.pDescrip, styles.fontTitleGreet)}
          style={{cursor: 'pointer', color: "#000000"}}
          onMouseEnter={this._handleMouseOn_SubDescrip}
          onMouseLeave={this._handleMouseOn_SubDescrip}>
          {this.props.i18nUIString.catalog['guidingShare_atBelong']}</p>
      )
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongForm)}>
        {
          (this.state.inOptions && this.state.records) ? (
            <div
              className={classnames(styles.boxPanel)}>
              <div
                style={{padding: '5px 2%'}}>
                {this._render_titleOptions()}
                <span
                  className={classnames(styles.spanReturn, styles.fontReturn)}
                  style={this.state.onReturn? {color: 'rgb(160,160,160)'}:{}}
                  onClick={this._set_stateInOptions}
                  onMouseEnter={this._handleMouseOn_formReturn}
                  onMouseLeave={this._handleMouseOn_formReturn}>
                  {" ← "}</span>
              </div>
              <BelongOptions
                _set_refresh={this._set_refresh}/>
            </div>

          ):(
            <div
              className={classnames(styles.boxGreet)}>
              {this._render_titleGreet()}
            </div>
          )
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
    fetchFlags: state.fetchFlags
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongForm));
