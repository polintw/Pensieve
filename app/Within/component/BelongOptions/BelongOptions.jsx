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
import {SearchModule} from '../../../Component/NodeComs.jsx';
import ModalBox from '../../../Component/ModalBox.jsx';
import ModalBackground from '../../../Component/ModalBackground.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../redux/actions/general.js";

const optionItem = (nodeId, self)=>{
  return (
    <div
      key={"key_Belong_options_"+index}
      nodeid={nodeId}
      onClick={(e)=>{e.stopPropagation();e.preventDefault(); self._set_choice(e.currentTarget.getAttribute('nodeid'));}}>
      <span>
        {self.props.nounsBasic[nodeId].name}
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
      options: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Options = this._render_Options.bind(this);
    this._set_nodeChoice = this._set_nodeChoice.bind(this);
    this._axios_GET_belongOptions = this._axios_GET_belongOptions.bind(this);
    //_axios post input to db
    this._set_choice = (choice)=> this.setState({choice: choice});
    this.style={

    }
  }

  _set_nodeChoice(nodeBasic){
    //create obj to fit the format of state in redux
    let insertObj = {};
    insertObj[nodeBasic.id] = nodeBasic;

    //pass the node basic into redux first,
    //so the handler would not need to fetch node data from db again
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.
    this._set_choice(nodeBasic.id);
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
          //check if the nodesList has anything just for res.data confirm.
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

  //_axios post, announce success to parent if no error

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
        {
          <div>
            <SearchModule
              _set_nodeChoice={this._set_nodeChoice}/>
          </div>
        }
        {
          this.state.choice &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                className={styles.boxDialog}>
                <ChoiceDialog
                  />
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
