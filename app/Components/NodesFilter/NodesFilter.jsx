import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../ImgPreview.jsx';
import {
  _axios_get_NodesLayer
} from './axios.js';
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
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleClick_switchUppeLayer = this._handleClick_switchUppeLayer.bind(this);
    this._handleClick_switcNextLayer = this._handleClick_switcNextLayer.bind(this);
    this._handleClick_switchStartList = this._handleClick_switchStartList.bind(this);

    this.nodeUsedLink = (linkObj, imgSrcCover, nodeId)=>{
      return (
        <div
          key={"key_nodesFilter_"+nodeId}
          className={classnames(styles.boxNodeItem)}>
          <Link
            to={linkObj}
            ref={this["filterNode"+ nodeId]}
            className={classnames(
              'plainLinkButton', styles.boxNodeItemLink)}
            onClick={this._handleClick_filterNode}>
            <div
              className={styles.boxImg}>
              <ImgPreview
                blockName={''}
                previewSrc={ imgSrcCover }
                _handleClick_ImgPreview_preview={()=>{this["filterNode"+nodeId].current.click()}}/>
            </div>
            <div
              className={classnames( styles.boxItemTitle)}>
              {
                (nodeId in this.props.nounsBasic) &&
                <div
                  className={classnames( styles.boxTitleText)}>
                  <span
                    className={classnames("fontSubtitle_h5", "weightBold", "colorEditBlack")}>
                    {this.props.nounsBasic[nodeId].name}
                  </span>
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <span
                      className={classnames("fontSubtitle_h5", "weightBold", "colorEditBlack")}>
                      {", "}
                    </span>
                  }
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <div>
                      <span
                        className={classnames("fontSubtitle_h5", "weightBold", "colorEditBlack")}>
                        {this.props.nounsBasic[nodeId].prefix}
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          </Link>
          {
            ((nodeId in this.props.nounsBasic) &&
            !(this.props.startListify && this.state.atStartListify) &&
            this.props.nounsBasic[nodeId].parentify) &&
            <div
              nodeid={nodeId}
              onClick={this._handleClick_switcNextLayer}>
              <span>
                {"children"}
              </span>
            </div>
          }
        </div>
      )
    }
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
    urlParams.forEach((value, key) => {
      searchStr+= (key + '=' + value);
    });
    // then going to render by params string & nodesList
    let nodesListDOM = [];
    list.forEach((nodeId, index)=>{
      // know first if this node has used.
      let firstUnitify = (nodeId in this.state.nodesUnits) ? true : false;
      let imgSrcCover = '',
          linkObj = {
            pathname: '/cosmic/explore/node' ,
            search: '?nodeid='+ nodeId,
            state: {from: this.props.location}
          };
      // but if the node has used, or if we are commant to
      if(firstUnitify || !this.props.nodePageify){
        linkObj = {
          pathname: this.props.match.url ,
          search: searchStr + '&filterNode=' + nodeId,
          state: {from: this.props.location}
        };
        let firstUnitId = this.state.nodesUnits[nodeId];
        imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'
          + ((firstUnitId in this.state.unitsBasic) ? this.state.unitsBasic[firstUnitId].pic_layer0: 'notyetprepared_inNodesFilter')
          +'?type=thumb';
      };
      this['filterNode'+ nodeId] = React.createRef(); // make a ref for only this component

      nodesListDOM.push( // preview only appear if the node was used
        // firstUnitify ? nodeUsedLink(linkObj, imgSrcCover, nodeId) :
        this.nodeUsedLink(linkObj, imgSrcCover, nodeId)
      );
      // and last, if this is the last round,
      // check the rest number to render a better look
      if( (index+1) == list.length ){
        let restNum = list.length % 4;
        if(restNum != 0){ // 1, 2 or 3
          for(let i=3; i>= restNum ;i--){
            nodesListDOM.push(
              <div
                className={classnames(styles.boxNodeItem)}
                style={{boxShadow: 'unset'}}>
              </div>
            );
          };
        };
      };
    })

    return nodesListDOM;
  }

  render(){
    return (
      <div className={styles.comNodesFilter}>
        <div className={styles.boxOptions}>
          {
            this.props.startListify &&
            <div
              className={classnames(styles.boxBtnOption)}
              onClick={this._handleClick_switchStartList}>
              {
                this.state.atStartListify ? (
                  <div>
                    <span
                      className={classnames(
                        "fontContent", "colorEditBlack")}
                      style={{marginRight: '4px'}}>
                      {this.props.i18nUIString.catalog['test_or_minor']}
                    </span>
                    <span
                      className={classnames(
                        "fontContent", "colorAssistOcean")}>
                      {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][0]}
                    </span>
                  </div>
                ) : (
                  <div>
                      <span
                        className={classnames(
                          "fontContent", "colorAssistOcean")}>
                        {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][1]}
                      </span>
                  </div>
                )
              }
            </div>
          }
          {
            !this.state.atStartListify &&
            <div
              className={classnames(styles.boxBtnOption)}
              onClick={this._handleClick_switchUppeLayer}>
              <span
                className={classnames(
                  "fontContent", "colorAssistOcean")}>
                {"．"}
                {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][2]}
              </span>
            </div>
          }
        </div>
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
      self._set_firstUnitBasic(resObj.main.nodesList);
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

  _handleClick_switchStartList(event){
    event.stopPropagation();
    event.preventDefault();
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

  _handleClick_switchUppeLayer(event){
    event.preventDefault();
    event.stopPropagation();
    // check first if there was a parent
    if(!this.state.baseParent) return;

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

  _handleClick_switcNextLayer(event){
    event.preventDefault();
    event.stopPropagation();
    let targetNode = event.currentTarget.getAttribute('nodeid');
    // check if any child by nounsBasic
    if(!this.props.nounsBasic[targetNode].parentify) return;

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

  _handleClick_filterNode(event){
    // nor stopPropagation neither preventDefault here
    // to make the <Link> work as expect
    this.props._handle_nodeClick();
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
