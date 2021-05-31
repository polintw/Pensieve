import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import MapNodesUnits from '../../../../Components/Map/MapNodesUnits.jsx';
import {
  _axios_get_Basic
} from '../utils.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  domain
} from '../../../../../config/services.js';

class TabMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetchedUnitsList: false,
      mapUnitsList: [],
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_unitsMap = this._render_unitsMap.bind(this);
    this._set_mapUnits = this._set_mapUnits.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_mapUnits()
  }

  componentWillUnmount(){

  }

  _render_unitsMap() {
    /*
    move from comp. NodesFilter
    */
    let unitsMarkers = [],
        centerCoor = [];
    // coordinates of each unit
    this.state.mapUnitsList.forEach((unitId, index) => {
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
              (unitsMarkers.length == 0)
            )
          ) &&
          <MapNodesUnits
            coordCenter={centerCoor}
            unitsMarkers={unitsMarkers}
            nodeMarkers={[]}
            styleZIndex={'5'}
            minZoomLevel={1}
            zoomLevel={centerCoor.length > 0 ? 15 : 2}/>
        }
      </div>
    )
  }

  render(){
    return (
      <div
        className={classnames(styles.comTabMap)}>
        <div
          className={classnames(styles.boxRow)}>
          {this._render_unitsMap()}
        </div>
        <div className={classnames(styles.boxRow, styles.boxFooter)}/>
      </div>
    )
  }

  _set_mapUnits(){
    const self = this;
    this.setState({axios: true});
    let paramsObjPublications = {
      filterNodes: [],
      limit: 120,
      pathProject: (this.props.lastParam == "pathProject") ? this.props.userInfo.pathName : null,
    };
    let paramsObjInspired = {
      filterNodes: [],
      limit: 120,
    };
    let fetchPublicationsList = new Promise((resolve, reject)=>{
      _axios_get_Basic(this.axiosSource.token, {
        url: "/router/share/accumulated",
        params: paramsObjPublications
      }).then((resObj)=>{ resolve(resObj) });
    }).catch((error)=>{ throw error; });
    let fetchInspiredsList = new Promise((resolve, reject)=>{
      _axios_get_Basic(this.axiosSource.token, {
        url: "/router/inspired/accumulated",
        params: paramsObjInspired
      }).then((resObj)=>{ resolve(resObj) });
    }).catch((error)=>{ throw error; });

    Promise.all([fetchPublicationsList, fetchInspiredsList])
    .then(([resPublications, resInspired])=>{
      let unitsList = resPublications.main.unitsList.concat(resInspired.main.unitsList);
      self.setState((prevState, props)=>{
        return {
          mapUnitsList: unitsList
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
)(TabMap));
