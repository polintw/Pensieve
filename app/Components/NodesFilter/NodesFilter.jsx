import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NodesImgUnits from './NodesImgUnits.jsx';
import MapNodesUnits from '../../Components/Map/MapNodesUnits.jsx';
import {
  handleNounsList,
} from "../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: [],
      nodesUnits: {},
      unitsList: [],
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_imagesNodes = this._render_imagesNodes.bind(this);
    this._set_nodesUnitsBasic = this._set_nodesUnitsBasic.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // mainly, distinguish if we had a start list, and at start list
    if(
      this.props.startList.length != prevProps.startList.length // or, startList changed(usually fetched at begining)
    ){
      this._set_nodesUnitsBasic(this.props.startList);
    }
  }

  componentDidMount(){
    // get the first units list for it
    this._set_nodesUnitsBasic(this.props.startList);
  }

  componentWillUnmount(){

  }

  _render_unitsMap() {
    return (
      <div
        className={classnames(styles.boxMap)}>
        <MapNodesUnits
          coordCenter={[20, 0]}
          markers={
            this.state.markersUsed
            /*[
            {
            nodeid:,
            coordinates:,
            additional(?): {
            accumulatedCount: ,
            latestUsed: time,
            firstUser: {}
            }
            }
            ]
            */}
            minZoomLevel={1}
            zoomLevel={9}/>
      </div>
    )
  }

  _render_imagesNodes(){
    // we need value in URL query
    let urlParams = new URLSearchParams(this.props.location.search), searchStr='?';
    urlParams.delete("filterNode"); // remove any filterNode inherit from props to be used in each node
    if(urlParams.has('_filter_nodes')) urlParams.delete("_filter_nodes"); // remove "_filter_nodes" because we would only go to 'close' the filter
    if(urlParams.has('_filter_map')) urlParams.delete("_filter_map"); // remove "_filter_nodes" because we would only go to 'close' the filter
    let paramsIndex = 0; // urlParams.forEach is an object instance, do not know the the index, so manually update
    urlParams.forEach((value, key) => {
      if(paramsIndex > 0) searchStr += "&";
      searchStr += (key + '=' + value);
      paramsIndex += 1;
    });
    // then going to render by params string & nodesList
    let nodesListDOM = [];
    this.props.startList.forEach((nodeId, index)=>{
      // then put DOM into list
      nodesListDOM.unshift( // preview only appear if the node was used
        <NodesImgUnits
          key={"key_NodesFilter_ImgBox_"+ index}
          {...this.props}
          nodeId={nodeId}
          searchStr={searchStr}
          nodesUnits={this.state.nodesUnits}
          unitsBasic={this.state.unitsBasic}
          _handleClick_filterNode={this.props._handle_nodeClick}/>
      );
    });

    return nodesListDOM;
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.viewFilterMap = urlParams.has('_filter_map');

    return (
      <div className={styles.comNodesFilter}>
        {
          this.viewFilterMap ?
          this._render_unitsMap() :
          this._render_imagesNodes()
        }
      </div>
    )
  }

  _set_nodesUnitsBasic(nodesList){
    const self = this;
    this.setState({axios: true});

    this.props._get_nodesUnitsList(nodesList)
    .then((resObj)=>{
      let nodesKey = Object.keys(resObj.main.nodesUnits);
      let unitsList = [];
      nodesKey.forEach((key, index) => {
        unitsList = unitsList.concat(resObj.main.nodesUnits[key]);
      });
      self.setState((prevState, props)=>{
        return {
          nodesUnits: {...prevState.nodesUnits, ...resObj.main.nodesUnits},
          unitsList: unitsList
        };
      });

      return axios_get_UnitsBasic(self.axiosSource.token, unitsList);
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
        });
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

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
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
)(NodesFilter));
