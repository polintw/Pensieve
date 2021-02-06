import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ItemImgBox from './ItemImgBox.jsx';
import ItemNodeLink from './ItemNodeLink.jsx';
import ItemLayerBase from './ItemLayerBase.jsx';
import NavLayers from './NavLayers.jsx';
import {
  _axios_get_NodesLayer
} from './axios.js';
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

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: [],
      baseNode: null,
      baseRole: '', // a token was used to tell the relation between baseNode & layer
      baseParent: null, // parent node of baseNode(null if not)
      atStartListify: true,
      nodesUnits: {},
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Nodes = this._render_Nodes.bind(this);
    this._set_nodesList = this._set_nodesList.bind(this);
    this._set_firstUnitBasic = this._set_firstUnitBasic.bind(this);
    this._set_SwitchNextLayer = this._set_SwitchNextLayer.bind(this);
    this._set_switchStartList = this._set_switchStartList.bind(this);
    this._set_switchUpperLayer = this._set_switchUpperLayer.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // mainly, distinguish if we had a start list, and at start list
    if(
      this.props.startListify &&
      this.state.atStartListify &&
      (
        (this.state.atStartListify != prevState.atStartListify) || // combined with above condition, back to start list
        this.props.startList.length != prevProps.startList.length // or, startList changed(usually fetched at begining)
      )
    ){
      this._set_firstUnitBasic(this.props.startList);
    }
    // not at start list, detect if
    else if(
      (this.state.baseNode != prevState.baseNode) || // baseNode change
      (this.state.baseRole != prevState.baseRole) || // baseRole change
      (!this.state.atStartListify && (this.state.atStartListify != prevState.atStartListify) // left start list
    )){
      this._set_nodesList(this.state.baseNode,  this.state.baseRole);
    };
  }

  componentDidMount(){
    // a special situation the component should start from a list passed from props,
    // get the first units list for it
    if(this.props.startListify && this.state.atStartListify){
      this._set_firstUnitBasic(this.props.startList);
    };
    if(!this.props.startListify && this.state.atStartListify){ // at start list and no list would passed from props
      this.setState({
        baseNode: this.props.startNode,
        atStartListify: false
      });
    }
  }

  componentWillUnmount(){

  }

  _render_Nodes(){
    // devide which list going to render first
    let list = (this.props.startListify && this.state.atStartListify) ? this.props.startList : this.state.nodesList;
    // we need value in URL query
    let urlParams = new URLSearchParams(this.props.location.search), searchStr='?';
    urlParams.delete("filterNode"); // remove any filterNode inherit from props to be used in each node
    if(urlParams.has('_filter_nodes')) urlParams.delete("_filter_nodes"); // remove "_filter_nodes" because we would only go to 'close' the filter
    let paramsIndex = 0; // urlParams.forEach is an object instance, do not know the the index, so manually update
    urlParams.forEach((value, key) => {
      if(paramsIndex > 0) searchStr += "&";
      searchStr += (key + '=' + value);
      paramsIndex += 1;
    });
    // then going to render by params string & nodesList
    let nodesListDOM = [];
    list.forEach((nodeId, index)=>{
      // know first if this node has used.
      let firstUnitify = (nodeId in this.state.nodesUnits) ? true : false;
      let imgSrcCover = '',
        linkObj = {
          pathname: this.props.match.url,
          search: searchStr + '&filterNode=' + nodeId,
          state: { from: this.props.location }
        };
      // but if the node has used, or if we are commant to
      if(firstUnitify || !this.props.nodePageify){
        let firstUnitId = this.state.nodesUnits[nodeId];
        imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'
          + ((firstUnitId in this.state.unitsBasic) ? this.state.unitsBasic[firstUnitId].pic_layer0: 'notyetprepared_inNodesFilter')
          +'?type=thumb';
      };

      // and then put DOM into list
      // put the one has firstUnit at the beginning
      if(firstUnitify){
        nodesListDOM.unshift( // preview only appear if the node was used
          <ItemImgBox
            key={"key_NodesFilter_ImgBox_"+ index}
            nodeId={nodeId}
            imgSrcCover={imgSrcCover}
            linkObj={linkObj}
            atStartListify={this.state.atStartListify}
            startListify={this.props.startListify}
            _set_SwitchNextLayer={this._set_SwitchNextLayer}
            _handleClick_filterNode={this.props._handle_nodeClick}/>
        );
      }
      else{
        nodesListDOM.push(
          <ItemNodeLink
            key={"key_NodesFilter_NodeLink"+ index}
            nodeId={nodeId}
            linkObj={linkObj}
            atStartListify={this.state.atStartListify}
            startListify={this.props.startListify}
            _set_SwitchNextLayer={this._set_SwitchNextLayer}
            _handleClick_filterNode={this.props._handle_nodeClick}/>
        )
      };

      // and last, if this is the last round,
      // check the rest number to render a better look
      if( (index+1) == list.length ){
        let restNum = list.length % 4;
        if(restNum != 0){ // 1, 2 or 3
          for(let i=3; i>= restNum ;i--){
            nodesListDOM.push(
              <div
                className={classnames(styles.boxNodeItem)}
                style={{boxShadow: 'unset', border: 'unset'}}>
              </div>
            );
          };
        };
      };
    })

    if(nodesListDOM.length == 0 ){
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
    };

    return nodesListDOM;
  }

  render(){
    /*
    '        <div className={styles.boxOptions}>
              <NavLayers
                atStartListify={this.state.atStartListify}
                startListify={this.props.startListify}
                baseParent={this.state.baseParent}
                _set_switchStartList={this._set_switchStartList}
                _set_switchUpperLayer={this._set_switchUpperLayer}/>
            </div>
      '
      was removed from beneath comp before further plan
    */
    return (
      <div className={styles.comNodesFilter}>
        {
          (!!this.state.baseParent && !(this.props.startListify && this.state.atStartListify)) &&
          <div className={styles.boxLayerBase}>
            <div
              className={classnames(styles.rowEight)}
              style={{marginLeft: '1.2%'}}>
              <span
                className={classnames(
                  "fontSubtitle_h5", 'colorStandard'
                )}>
                {this.props.i18nUIString.catalog['title_nodesFilter_LayerBase']}
              </span>
            </div>
            <div
              className={classnames(styles.rowEight)}
              style={{marginLeft: '1%'}}>
              <ItemLayerBase
                nodeId={this.state.baseParent}
                atStartListify={this.state.atStartListify}
                startListify={this.props.startListify}
                firstUnit={(this.state.baseParent in this.state.nodesUnits) ? true : false}
                firstUnitSrc={
                  (this.state.baseParent in this.state.nodesUnits) ? (this.state.nodesUnits[this.state.baseParent] in this.state.unitsBasic) ?
                   this.state.unitsBasic[this.state.nodesUnits[this.state.baseParent]].pic_layer0: false : false}
                _set_SwitchNextLayer={this._set_SwitchNextLayer}
                _handleClick_filterNode={this.props._handle_nodeClick}/>
            </div>
            <div
              className={classnames(styles.rowEight)}
              style={{textAlign: 'center'}}>
              <span
                className={classnames(
                  "fontSubtitle_h5", 'colorEditBlack'
                )}>
                {"．．．"}
              </span>
            </div>
          </div>
        }
        <div className={styles.boxNodesList}>
          {this._render_Nodes()}
        </div>
      </div>
    )
  }

  _set_firstUnitBasic(nodesList){
    const self = this;
    this.setState({axios: true});

    this.props._get_firstUnitsList(nodesList)
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          nodesUnits: {...prevState.nodesUnits, ...resObj.main.nodesUnits}
        };
      });
      let nodesKey = Object.keys(resObj.main.nodesUnits);
      let unitsList = nodesKey.map((key, index)=>{
        return resObj.main.nodesUnits[key];
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

  _set_nodesList(baseNode, baseRole){
    const self = this;
    this.setState({axios: true});
    let paramsObj = {
      baseNode: baseNode,
      asParent: baseRole=="parent" ? true : false, // ask as parent, could be 'undefined'
      parent: true // return parent of list
    }

    _axios_get_NodesLayer(this.axiosSource.token, paramsObj)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          nodesList: resObj.main.nodesList,
          baseParent: resObj.main.nodeParent
        });
      });
      let reqFirstUnitList = resObj.main.nodesList.slice();
      // we add parent node into list to also fetch first unit for parent node
      if(!!resObj.main.nodeParent){reqFirstUnitList.push(resObj.main.nodeParent);};
      self._set_firstUnitBasic(reqFirstUnitList);
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

  _set_SwitchNextLayer(targetNode) {
    this.setState({
      nodesList: [],
      baseNode: targetNode,
      baseRole: 'parent',
      baseParent: null,
      atStartListify: false,
      nodesUnits: {},
      unitsBasic: {}
    });
  }

  _set_switchStartList(){
    this.setState((prevState, props)=>{
      return {
        nodesList: [],
        baseNode: prevState.atStartListify ? this.props.startNode: prevState.baseNode, // no change if back to startList
        baseParent: null,
        atStartListify: prevState.atStartListify ? false : true,
        nodesUnits: {},
        unitsBasic: {}
      };
    });
  }

  _set_switchUpperLayer(){
    this.setState((prevState, props)=>{
      return {
        nodesList: [],
        baseNode: prevState.baseParent,
        baseRole: 'same',
        baseParent: null,
        atStartListify: false,
        nodesUnits: {},
        unitsBasic: {}
      };
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
