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
import DemandNode from './DemandNode.jsx'
import {
  axios_get_options,
  axios_post_taking
} from '../../utilsMatchNodes.js';
import {
  handleNounsList
} from "../../../../../redux/actions/general.js";
import {
  setFlag
} from "../../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';

class Demand extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      demandList: [],
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._render_DemandOptions = this._render_DemandOptions.bind(this);
    this.style={

    }
  }

  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    axios_get_options(this.axiosSource.token, 'demand')
    .then((resObj)=>{
      let nodesList = resObj.main.nodesList;

      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
      self.setState({
        axios: false,
        demandList: nodesList
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

  }

  componentDidMount() {
    this._fetch_List();
  }

  componentWillUnmount() {

  }

  _render_DemandOptions(){
    //render by the list saved in local state
    let itemsDOM = this.state.demandList.map((nodeId, index)=>{
      return (
        <DemandNode
          key={"key_DemandList_"+index}
          displayingNode={nodeId}
          _submit_taking={(submitNode)=>{axios_post_taking(this.axiosSource.token, submitNode);}}/>
      )
    });

    return itemsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comDemand)}>
        <div
          className={classnames(styles.boxOptions)}>
          {this._render_DemandOptions()}
        </div>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames(stylesMain.fontSubTitle)}>
            {
              this.props.i18nUIString.catalog["title_Main_matchDemand"][0]}
          </span>
          <br/>
          <span
            className={classnames(stylesMain.fontDescrip)}>
            {
              this.props.i18nUIString.catalog["title_Main_matchDemand"][1]}
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    indexLists: state.indexLists
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
)(Demand));
