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
import {
  domain
} from '../../../config/services.js';


class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetchedUnitsList: false,
      nodesUnits: {},
      unitsList: [],
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_unitsMap = this._render_unitsMap.bind(this);
    this._render_imagesNodes = this._render_imagesNodes.bind(this);
    this._set_nodesUnitsBasic = this._set_nodesUnitsBasic.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // mainly, distinguish if we had a start list, and at start list
    if(
      this.props.startList.length != prevProps.startList.length // or, startList changed(usually fetched at begining)
    ){
      this.setState({fetchedUnitsList: false}); // back to the init status
      this._set_nodesUnitsBasic(this.props.startList);
    }
  }

  componentDidMount(){
    // get the first units list for it
    if(this.props.startList.length > 0) this._set_nodesUnitsBasic(this.props.startList);
  }

  componentWillUnmount(){

  }

  _render_unitsMap() {
    let nodeMarkers = [], unitsMarkers = [],
        centerCoor = [];
    // coordinates of node
    // make searchStr for the node marker
    let urlParams = new URLSearchParams(this.props.location.search), searchStr='?';
    urlParams.delete("filterNode"); // remove any filterNode inherit from props to be used in each node
    if(urlParams.has('_filter_nodes')) urlParams.delete("_filter_nodes"); // remove "_filter_nodes" because we would only go to 'close' the filter
    if(urlParams.has('_filter_map')) urlParams.delete("_filter_map");
    let paramsIndex = 0; // urlParams.forEach is an object instance, do not know the index, so manually update
    urlParams.forEach((value, key) => {
      if(paramsIndex > 0) searchStr += "&";
      searchStr += (key + '=' + value);
      paramsIndex += 1;
    });
    this.props.startList.forEach((nodeId, index) => {
      if(nodeId in this.props.nounsBasic && 'latitude' in this.props.nounsBasic[nodeId]){
        nodeMarkers.push({
          nodeId: nodeId,
          coordinates: [this.props.nounsBasic[nodeId]['latitude'], this.props.nounsBasic[nodeId]['longitude']],
          link: {
            path: this.props.match.url,
            search: searchStr + '&filterNode=' + nodeId,
            state: { from: this.props.location }
          }
        })
      };
    });
    // coordinates of each unit
    this.state.unitsList.forEach((unitId, index) => {
      if(unitId in this.state.unitsBasic && "coordinates" in this.state.unitsBasic[unitId]){
        unitsMarkers.push({
          unitId: unitId,
          coordinates: [this.state.unitsBasic[unitId]['coordinates'].latitude, this.state.unitsBasic[unitId]['coordinates'].longitude],
          unitImgSrc: domain.protocol+ '://'+domain.name+'/router/img/'+ this.state.unitsBasic[unitId].pic_layer0+'?type=thumb',
          link: {
            path: this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit'),
            search: this.props.location.search + '&' +'unitId='+ unitId + '&unitView=theater',
            state: { from: this.props.location }
          }
        });
        // and the centerCoor was set to the last unit has coordinates
        centerCoor = [this.state.unitsBasic[unitId]['coordinates'].latitude, this.state.unitsBasic[unitId]['coordinates'].longitude];
      };
    });
    // set map center to a node if no Unit coordinates was used
    if(centerCoor.length == 0){
      centerCoor = (nodeMarkers.length > 0) ? nodeMarkers[0]["coordinates"] : [];
      if(this.props.startNode in this.props.nounsBasic && 'latitude' in this.props.nounsBasic[this.props.startNode]){
        centerCoor = [this.props.nounsBasic[this.props.startNode]['latitude'], this.props.nounsBasic[this.props.startNode]['longitude']];
      };
    };

    return (
      <div
        className={classnames(styles.boxMap)}>
        {
          /*
          the situation is, we have to render the Map after everything was fetched and confirmed.
          Because, the module <MapContainer> we use was 'immutable', by the rule the author set.
          The 'props.startList' has prepared before the component mount, no need to check;
          mainly focus on 'state.unitsList' & 'centerCoor'.
          */
          (
            this.state.fetchedUnitsList &&
            ( // if everything was fetched, permission if we haver a center or 'not any' unit
              (centerCoor.length > 0) ||
              ((nodeMarkers.length == 0) && (unitsMarkers.length == 0))
            )
          ) &&
          <MapNodesUnits
            coordCenter={centerCoor}
            unitsMarkers={unitsMarkers}
            nodeMarkers={nodeMarkers}
            styleZIndex={'5'}
            minZoomLevel={1}
            zoomLevel={centerCoor.length > 0 ? 15 : 2}/>
        }
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
      nodesListDOM.push( // preview only appear if the node was used
        <NodesImgUnits
          key={"key_NodesFilter_ImgBox_"+ index}
          {...this.props}
          nodeId={nodeId}
          searchStr={searchStr}
          nodesUnits={this.state.nodesUnits}
          unitsBasic={this.state.unitsBasic}
          _handleClick_filterNode={this.props._handle_nodeClick}/>
      );
      if( (index+1) != this.props.startList.length ){ // not the last in list
        nodesListDOM.push(
          <div style={{borderTop: 'solid 1px #d8d8d8', width: '96%', margin: '12px 0'}}></div>
        )
      }
    });
    if(nodesListDOM.length == 0){ // means no Shared at all, remind share
      nodesListDOM.push(
        <div
          className={classnames(styles.boxEmptyDescript)}>
          <span
            className={classnames("fontTitleSmall", "colorLightGrey")}
            style={{display: 'inline-block', width: '200px'}}>
            {this.props.i18nUIString.catalog['guiding_noAccumulated_nodeFilter']}
          </span>
          <br/>
        </div>
      )
    }

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
          fetchedUnitsList: true
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
