import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import MapCorner from './MapCorner.jsx';
import {
  _axios_GET_feed_Fellows
} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";

class FellowsResidence extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      cornersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_corners = this._render_corners.bind(this);
    this._init_fetch = this._init_fetch.bind(this);
  }


  _init_fetch(){
    const self = this;
    this.setState({axios: true});

    _axios_GET_feed_Fellows(
      this.axiosSource.cancelToken,
      this.props.viewNode,
      {baseCat: 'residence', curiousArr: ['homeland']}
    )
    .then((resObj)=>{
      const nodesList= resObj.main.nodesList;
      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action

      self.setState({
        axios: false,
        cornersList: nodesList
      });
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
    if(this.props.viewNode != prevProps.viewNode){
      this._init_fetch();
    }
  }

  componentDidMount(){
    this._init_fetch()
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_corners(){
    let listDOM = this.state.cornersList.map((nodeId, index)=>{
      return (
        <div
          key={"_key_fellowsResiCorners_"+index}
          className={classnames(styles.boxMapCorner)}>
          <MapCorner
            nodeId={nodeId}
            typeNodeId={this.props.viewNode}
            currentType={'residence'}
            typeReverse={'homeland'}/>
        </div>
      )
    });
    if(!this.props.belongsByType['residence']) { // no homeland record from the begining
      listDOM = [(
        <div
          key={"_key_fellowsResidenceCorners_unset"}
          style={{width: '100%', margin: '8px 0'}}>
          <div
            style={{width: '100%', height: '51px', minHeight: '4.1vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}/* follow styles.boxImg*/}>
            <span
              className={classnames("fontTitleSmall", "colorGrey")}>
              {this.props.i18nUIString.catalog["guidingBelongs_EmptyMap_noSet"][0]}
              &nbsp;
              {this.props.i18nUIString.catalog['category_Belongs_'][1]}
              {this.props.i18nUIString.catalog["guidingBelongs_EmptyMap_noSet"][1]}
            </span>
          </div>
        </div>
      )];
    }else if(listDOM.length ==0){ // no users among this node--- or only the user himself but lacking another belong setting
      listDOM = [(
        <div
          key={"_key_fellowsResidenceCorners_empty"}
          style={{width: '100%', margin: '8px 0'}}>
          <div
            style={{width: '100%', height: '51px', minHeight: '4.1vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}/* follow styles.boxImg*/}>
            <span
              className={classnames("fontTitleSmall", "colorGrey")}>
              {this.props.i18nUIString.catalog["guidingBelongs_EmptyMap_"]}
            </span>
          </div>
        </div>
      )];
    }

    return listDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.boxModule, styles.boxModuleSmall)}>
        {this._render_corners()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
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
)(FellowsResidence));
