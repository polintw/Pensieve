import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {updateNodesBasic} from '../../../../../redux/actions/general.js'
import {NodeSearchModule} from '../../../../../Component/NodeSearchModule.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../../../redux/actions/general.js";

class BelongOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onOption: false, //for mouse enter interaction
      options: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Options = this._render_Options.bind(this);
    this._handleEnter_optionBelong = this._handleEnter_optionBelong.bind(this);
    this._handleLeave_optionBelong = this._handleLeave_optionBelong.bind(this);
    this._handleClick_SubmitvonOpions = this._handleClick_SubmitvonOpions.bind(this);
    this._axios_GET_belongOptions = this._axios_GET_belongOptions.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this.style={

    }
  }

  _handleEnter_optionBelong(e){
    this.setState({
      onOption: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_optionBelong(e){
    this.setState({
      onOption: false
    })
  }

  _handleClick_SubmitvonOpions(e){
    e.stopPropagation();
    e.preventDefault();
    //the submit from option was different from the one from NodeSearchModule,
    //it is alredy has record in reducer(nounsBasic) and only knew the id
    //so we pass it separately as well.
    this.props._set_choiceAnType(e.currentTarget.getAttribute('nodeid'), this.props.type);
    this.props._set_settingModal();
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

    //and pass the choice to
    this.props._set_choiceAnType(nodeBasic.id, this.props.type);
    this.props._set_settingModal();
  }

  _axios_GET_belongOptions(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/options/nodes/belong',
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


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._axios_GET_belongOptions();

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_Options(){
    let itemsDOM = this.state.options.map((nodeId, index)=>{
      return (
        <div
          key={"key_Belong_options_"+nodeId}
          nodeid={nodeId}
          className={classnames(styles.boxAOption, styles.fontOption)}
          style={(this.state.onOption== nodeId) ? {
            backgroundColor:'rgb(255,255,255)',boxShadow: '0 0 1px rgb(255,122,95)'
          }:{}}
          onClick={this._handleClick_SubmitvonOpions}
          onMouseEnter={this._handleEnter_optionBelong}
          onMouseLeave={this._handleLeave_optionBelong}>
          <span
            className={styles.spanOption}>
            {nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[nodeId].name) : (
                null
              )}
          </span>
        </div>
      );
    });

    return itemsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongOptions)}>
        <div
          className={classnames(styles.boxTypeSetting)}>
          <span
            className={classnames(
              styles.spanType,
              styles.fontType,
              styles.fontOnType
            )}
            style={{lineHeight: '3rem'}}>
            {this.props.type}</span>
        </div>
        <NodeSearchModule
          type={"option"}
          _set_nodeChoice={this._set_choiceFromSearch}
          _set_SearchModal_switch={this.props._set_settingModal}
          _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this.props._set_settingModal();}}/>
        <div
          className={classnames(styles.boxOptions)}>
          {this._render_Options()}
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
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongOptions));
