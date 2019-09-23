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
import {updateNodesBasic} from '../../../redux/actions/general.js'
import ChoiceDialog from '../../../Component/ChoiceDialog.jsx';
import {NounsSearchModal} from '../../../Component/NodeComs.jsx';
import ModalBox from '../../../Component/ModalBox.jsx';
import ModalBackground from '../../../Component/ModalBackground.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../redux/actions/general.js";

const optionsType= [{name: "residence"}, {name: "hometown"}, {name: "stay"}];

const optionItem = (nodeId, self)=>{
  return (
    <div
      key={"key_Belong_options_"+nodeId}
      nodeid={nodeId}
      className={classnames(styles.boxOption, styles.fontOption)}
      onClick={(e)=>{e.stopPropagation();e.preventDefault(); self._set_choice(e.currentTarget.getAttribute('nodeid'));self._set_Dialog();}}>
      <span
        className={styles.spanOption}>
        {nodeId in self.props.nounsBasic ? (
          self.props.nounsBasic[nodeId].name) : (
            null
          )}
      </span>
    </div>
  )
}

class BelongOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      choice: null, //record the chosen node
      dialog: false, //whether dialog opened
      search: false, //whether search modal opened
      options: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Options = this._render_Options.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handlesubmit_newBelong = this._handlesubmit_newBelong.bind(this);
    this._axios_GET_belongOptions = this._axios_GET_belongOptions.bind(this);
    this._axios_PATCH_belongRecords = this._axios_PATCH_belongRecords.bind(this);
    this._set_choice = (choice)=> this.setState({choice: choice});
    this._set_Dialog = ()=> this.setState((prevState,props)=>{ return {dialog: prevState.dialog? false:true};});
    this._set_searchModal = ()=> this.setState((prevState,props)=>{return {search: prevState.search? false:true};});
    this.style={

    }
  }

  _set_choiceFromSearch(nodeBasic){
    //create obj to fit the format of state in redux
    let insertObj = {};
    insertObj[nodeBasic.id] = nodeBasic;

    //pass the node basic into redux first,
    //so the handler would not need to fetch node data from db again
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.
    this.setState((prevState,props)=>{
      return {
        choice: nodeBasic.id,
        dialog: true,
        search: false
      };
    });
  }

  _axios_GET_belongOptions(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/feed/options/belong',
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
          options: resObj.main.nodesList.length> 0 ? resObj.main.nodesList : []
          //check if the nodesList has anything, just for confirmation, no special purpose.
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


  _axios_PATCH_belongRecords(submitObj,callback){
    this.setState({axios: true});
    const self = this;

    axios({
      method: 'patch',
      url: '/router/profile/sheetsNodes',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken,
      data: submitObj
    }).then(function (res) {
      self.setState({axios: false});
      callback();
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

  _handlesubmit_newBelong(type){
    //close the Dialog, make sure the passed data(match type) would not dissapear
    //post new submit passed from Dialog

    //lock the options at the same time by detect axios state
    //final inform parent refresh the com
    let typeIndex = optionsType.indexOf(type); //assure the type won'y dissapear if the dialog unmount first
    let objBelong = {};
    objBelong[optionsType[typeIndex]] = this.state.choice;
    this._set_Dialog();
    this._axios_PATCH_belongRecords({belong: objBelong}, this.props._set_refresh);

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._axios_GET_belongOptions();

  }

  componentWillUnmount() {

  }

  _render_Options(){
    let items = this.state.options.map((nodeId, index)=>{
      return optionItem(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongOptions)}>
        {this._render_Options()}
        <div
          style={{display:'inline-block', marginLeft: '3%', fontSize:'1.2rem',letterSpacing: '0.02rem',color: '#aeaeae'}}
          onClick={(e)=>{e.stopPropagation();e.preventDefault(); this._set_searchModal()}}>
          {"Search..."}
        </div>
        {
          this.state.search &&
          <div>
            <NounsSearchModal
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_searchModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_searchModal();}}/>
          </div>
        }
        {
          this.state.dialog &&
          //should give it a 'dark' bg, position near the BelongOptions itself
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                className={styles.boxDialog}>
                <ChoiceDialog
                  optionsList={optionsType}
                  leavingChoice={'cancel'}
                  message={this.props.i18nUIString.catalog['messageChoiceBelong'][0]+this.props.nounsBasic[this.state.choice].name+this.props.i18nUIString.catalog['messageChoiceBelong'][1]}
                  _leavingHandler={this.props._set_refresh}
                  _submitHandler={this._handlesubmit_newBelong}/>
              </div>
            </ModalBackground>
          </ModalBox>
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
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongOptions));
