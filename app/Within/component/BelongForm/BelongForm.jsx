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
      key={"key_Belong_records_"+index}
      to={"/cosmic/nodes/"+nodeId}
      className={'plainLinkButton'}>
      <span>
        {nodeId in self.props.nounsBasic ? (
          self.props.nounsBasic[nodeId].name) : (
            null
          )}
      </span>
    </Link>
  )
}

class BelongForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      records: false, //would be an array after the axios get the records from db
      viewForm: false //judge whether open the Options or not
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_actionDescrip = this._render_actionDescrip.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._set_stateViewForm = ()=>{
      this.setState((prevState, index)=>{return {viewForm: prevState.viewForm ? false: true};}); };
    this.style={

    }
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
          viewForm: resObj.main.nodesList.length> 0 ? prevState.viewForm : true
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
    this._set_stateViewForm();
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
    if(this.state.records.length< 3){ //has records, but not all set
      return (
        <p
          onClick={this._handleClick_editBelong}>{this.props.i18nUIString.catalog['guidingEditBelong']}</p>
      );}
    else if(this.state.records.length> 2){ //records all set, display 'edit'  in the future
      return (<p/> //also use '_handleClick_editBelong' in the future
      );}
    else{ //in case true/false, mainly meaning there is not any records
      return (<p>{this.props.i18nUIString.catalog['guidingNewBelong']}</p>)
    }
    //there is third kind of situation: "edit"  to just edit current list after all 3 are redorded
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
          <div>
            {this._render_BelongList()}
          </div>
        }
        {
          this.state.records &&
          <div>
            {this._render_actionDescrip()}
            {
              this.state.viewForm &&
              <BelongOptions/>
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
