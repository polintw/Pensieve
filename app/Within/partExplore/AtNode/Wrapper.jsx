import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import NavFeed from './NavFeed/NavFeed.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import NavWihtinCosmic from '../../../Components/NavWithin/NavWihtinCosmic.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // if change the node bymodifying the nodeid in search, the page would only update
    let lastUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    let lastNodeAtId = lastUrlParams.get('nodeid');
    if(this.nodeAtId != lastNodeAtId){
      this.props._submit_NounsList_new([this.nodeAtId]);
    }
  }

  componentDidMount(){
    // this is a independent page for node, we have to assure it could get the basic info about this node
    this.props._submit_NounsList_new([this.nodeAtId]);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.nodeAtId = urlParams.get('nodeid');

    return(
      <div>
        <div
          className={classnames(styles.comAtNode)}>
          <div
            className={classnames(
              styles.boxNavCosmic,
              styles.smallDisplayNone)}>
            <NavWihtinCosmic/>
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxTitle)}
            style={{paddingBottom: '14px'}}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              { this.nodeAtId in this.props.nounsBasic ? (this.props.nounsBasic[this.nodeAtId].name) : null }
            </span>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              { this.nodeAtId in this.props.nounsBasic ? (
                (this.props.nounsBasic[this.nodeAtId].prefix.length > 0) &&
                (", " + this.props.nounsBasic[this.nodeAtId].prefix)) : (null)
              }
            </span>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <NavFeed {...this.props}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <Feed/>
          </div>

          <div className={classnames(styles.boxDecoBottom, styles.smallDisplayNone)}></div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    nounsBasic: state.nounsBasic
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
)(Wrapper));
