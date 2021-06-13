import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedNodesEmpty from './FeedNodesEmpty.jsx';
import {_locationsNodes_mapHandler} from './utils.js';
import {_axios_get_Basic} from '../utils.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class FeedNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: [],
      notesNodes: [],
      inspiredNodes: [],
      batchLocationsNodes: [],
      cateLocationsNodes: {},
      cateTopicsNodes: [],
      nextFetchBasedTime: null,
      scrolled: true,
      onBtn: null
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_nodesFeed = this._set_nodesFeed.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNodes = this._render_FeedNodes.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.filterCategory.length != prevProps.filterCategory.length){ // category was add or delete
      // reset all the list
      this.setState({
        nodesList: [],
        notesNodes: [],
        inspiredNodes: [],
        batchLocationsNodes: [],
        cateLocationsNodes: {},
        cateTopicsNodes: [],
        nextFetchBasedTime: null,
        scrolled: true,
      });
      this._set_nodesFeed();
    }
  }

  componentDidMount(){
    this._set_nodesFeed();
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    if (this.state.nodesList.length> 0){
      return (
        <div>
          <span
            className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
            {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}
          </span>
        </div>
      );
    }
    else{ // most reason to:no feed at all
      return null;
    }
  }

  _render_FeedNodes(nodesCategory){
    let groupsDOM = [];
    const _nodeDOM = (nodeId, index)=>{
      //render if there are something in the data
      if( !(nodeId in this.props.nounsBasic)) return; //skip if the info of the unit not yet fetch
      let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
      toSearch.set("filterNode", nodeId);
      let linkObj = {
        pathname: this.props.location.pathname,
        search: toSearch.toString(),
        state: {from: this.props.location}
      };

      return (
        <Link
          key={"key_NodeFeed_new_"+ nodeId +"_"+ index}
          to={linkObj}
          nodeid={nodeId}
          className={classnames(
            "plainLinkButton", styles.boxModuleItem,
            {[styles.boxModuleItemMouseOn]: this.state.onBtn == nodeId}
          )}
          onTouchStart={this._handleEnter_Btn}
          onTouchEnd={this._handleLeave_Btn}
          onMouseEnter={this._handleEnter_Btn}
          onMouseLeave={this._handleLeave_Btn}>
          <span
            className={classnames(
              "fontSubtitle_h5", "colorEditBlack", styles.spanModuleItem,
              {
                [styles.spanModuleItemMouseOn]: this.state.onBtn == nodeId,
              }
            )}>
            {this.props.nounsBasic[nodeId].name}
          </span>
          {
            (this.props.nounsBasic[nodeId].prefix.length > 0) &&
            <span
              className={classnames(
                "fontContentPlain", "colorGrey", styles.spanModuleItem,
                {
                  [styles.spanModuleItemMouseOn]: this.state.onBtn == nodeId,
                }
              )}>
              { this.props.nounsBasic[nodeId].prefix }
            </span>
          }
        </Link>
      );
    };
    const _nodes_ByGroup = (nodesGroup, groupIndex)=>{
      let nodesDOM = [];
      nodesGroup.forEach((nodeId, index) => {
        nodesDOM.push(_nodeDOM(nodeId, index));
      });
      return nodesDOM;
    };
    const _nodes_ByLocationLevel = ()=>{
      const nodesListMap = this.state[nodesCategory];
      let list = []; // make a list have items ordered by nodes map
      // to avoid mutate the this.state, we have to make an additional set contain the 'deleted' item for later process
      let pairUsed_length1 = [];
      let pairUsed_length2 = [];

      let keys = ['length_0', 'length_1', 'length_2'];
      keys.forEach((key, indexStateList) => {
        switch (key) {
          case "length_0":
            nodesListMap[key].forEach((nodeId, indexNode) => {
              list.push(nodeId);
              if(nodeId in nodesListMap['length_1']){
                nodesListMap['length_1'][nodeId].forEach((nodeId_1, indexLength1) => {
                  list.push(nodeId_1);
                  if(nodeId_1 in nodesListMap['length_2']){
                    list = list.concat(nodesListMap['length_2'][nodeId_1]);
                    pairUsed_length2.push(nodeId_1.toString());
                  };
                });
                pairUsed_length1.push(nodeId.toString());
              };
              if(nodeId in nodesListMap['length_2']){
                list = list.concat(nodesListMap['length_2'][nodeId]);
                pairUsed_length2.push(nodeId.toString());
              };
            });
            break;
          case "length_1":
            let length_1_keysRemained = Object.keys(nodesListMap[key]);
            length_1_keysRemained.forEach((keyRemained, indexKey) => {
              // check if the key should be removed due to a used parent
              if(pairUsed_length1.indexOf(keyRemained) >= 0) return;
              nodesListMap[key][keyRemained].forEach((nodeId, indexNode) => {
                list.push(nodeId);
                if(nodeId in nodesListMap['length_2']){
                  list = list.concat(nodesListMap['length_2'][nodeId]);
                  pairUsed_length2.push(nodeId.toString());
                };
              });
            });
            break;
          case "length_2":
            let length_2_keysRemained = Object.keys(nodesListMap[key]);
            length_2_keysRemained.forEach((keyRemained, indexKey) => {
              // check if the key should be removed due to a used parent
              if(pairUsed_length2.indexOf(keyRemained) >= 0) return;
              nodesListMap[key][keyRemained].forEach((nodeId, indexNode) => {
                list.push(nodeId);
              });
            });
            break;
          default:
            null
        };
      });
      let nodesDOM = list.map((nodeId, index)=>{
        return _nodeDOM(nodeId, index);
      });
      return nodesDOM;
    };

    if(nodesCategory == 'cateTopicsNodes'){
      this.state[nodesCategory].forEach((nodesGroup, index)=>{
        groupsDOM.push(
          <div
            key={"key_PathProject_nodesGroup"+index}
            className={classnames(
              styles.boxModuleCenter,
            )}>
            {_nodes_ByGroup(nodesGroup, index)}
          </div>
        );
      });
    }
    else if(nodesCategory == 'cateLocationsNodes'){
      groupsDOM.push(
        <div
          key={"key_PathProject_nodesGroup_locatioinsLevel"}
          className={classnames(
            styles.boxModuleCenter,
          )}>
          {_nodes_ByLocationLevel()}
        </div>
      );
    };

    return groupsDOM;
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.pathProjectify = urlParams.has('pathProject');

    return (
      <div className={styles.comFocusBoardFeed}>
        {
          (this.state.nodesList.length > 0) &&
          <div
            className={classnames(
              styles.boxRow
            )}>
            <div>
              {this._render_FeedNodes(['cateTopicsNodes'])}
            </div>
            {
              (this.state.cateTopicsNodes.length > 0 && this.state.batchLocationsNodes.length > 0) &&
              <div
                className={classnames(styles.boxDecoLine)}>
                <svg viewBox="0 0 20 20"
                  style={Object.assign({}, {
                    height: '100%',
                    maxWidth: '100%',
                    position: 'relative',
                    boxSizing: 'border-box'
                  })}>
                  <circle fill="#a3a3a3" cx="10" cy="10" r="5"></circle>
                </svg>
              </div>
            }
            <div>
              {this._render_FeedNodes(['cateLocationsNodes'])}
            </div>
          </div>
        }
        {
          ((this.state.nodesList.length == 0) &&
            !this.state.scrolled &&
            !this.state.axios
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
              styles.boxRow
            )}>
            <FeedNodesEmpty
              {...this.props}/>
          </div>
        }

        <div ref={this.refScroll}/>
        <div
          className={classnames(styles.boxRow, styles.boxFooter)}>
          {this._render_FooterHint()}
        </div>
      </div>
    )
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 2.5 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios &&
      boxScrollBottom < (2.5*windowHeightInner) &&
      boxScrollBottom > windowHeightInner && // safety check, especially for the very beginning, or nothing in the list
      this.state.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_nodesFeed();
    }
  }

  _set_nodesFeed(nextFetchBasedTime){
    // feeds was selected by the last unit get last round
    nextFetchBasedTime = !!this.state.nextFetchBasedTime ? this.state.nextFetchBasedTime : new Date();
    const self = this;
    this.setState({axios: true});
    // prepare request for both 'notes' & 'inspired' nodes
    let paramsObjNotes = {
      basedTime: nextFetchBasedTime,
      pathProject: this.pathProjectify ? this.props.userInfo.pathName: null,
      seperate: true
    };
    let paramsObjInspired = {
      seperate: true
    };
    let fetchNotesNodes = new Promise((resolve, reject)=>{
      _axios_get_Basic(this.axiosSource.token, {
        url: "/router/share/nodes/assigned",
        params: paramsObjNotes
      }).then((resObj)=>{ resolve(resObj) });
    }).catch((error)=>{ throw error; });
    let fetchInspiredsNodes = new Promise((resolve, reject)=>{
      _axios_get_Basic(this.axiosSource.token, {
        url: "/router/inspired/nodes/assigned",
        params: paramsObjInspired
      }).then((resObj)=>{ resolve(resObj) });
    }).catch((error)=>{ throw error; });
    // .props would indicate how many 'category' should be fetched('notes', 'inspired')
    let promiseList = this.props.filterCategory.map((item, index)=>{
      // currently only 2 possibility, so we do this in one operator
      return item == "notes" ? fetchNotesNodes : fetchInspiredsNodes;
    });

    Promise.all(promiseList)
    .then((resArr)=>{
      let resNotes = {main: {locationsList: [], topicsList: []}},
          resInspired = {main: {locationsList: [], topicsList: []}};
      self.props.filterCategory.forEach((item, index)=>{
        if(item == 'notes') resNotes = resArr[index]
        else resInspired = resArr[index];
      });
      let mixedLocationsNodes = resNotes.main.locationsList.slice();
      let mixedTopicsNodes = resNotes.main.topicsList.slice();
      resInspired.main.locationsList.forEach((node, index) => {
        if(mixedLocationsNodes.indexOf(node) < 0) mixedLocationsNodes.push(node);
      });
      resInspired.main.topicsList.forEach((node, index) => {
        if(mixedTopicsNodes.indexOf(node) < 0) mixedTopicsNodes.push(node);
      });
      let mixedNodesList = mixedLocationsNodes.concat(mixedTopicsNodes);
      //after res: call get nouns
      self.props._submit_NounsList_new(mixedNodesList) // the redux action handler would return a promise.resolve() back
      .then(()=>{
        self.setState((prevState, props)=>{
          let copiedLocationsNodes = prevState.batchLocationsNodes.slice();
          let copiedTopicsNodes = prevState.cateTopicsNodes.slice();
          if(mixedLocationsNodes.length > 0) copiedLocationsNodes.push(mixedLocationsNodes);
          if(mixedTopicsNodes.length > 0) copiedTopicsNodes.push(mixedTopicsNodes);
          let locationsNodesMapState = _locationsNodes_mapHandler(copiedLocationsNodes, this.props.nounsBasic);

          return {
            axios: false,
            cateLocationsNodes: locationsNodesMapState, // nodes lists in length map
            cateTopicsNodes: copiedTopicsNodes,
            batchLocationsNodes: copiedLocationsNodes, // nodes lists by req order
            // now we fetch the list all at once, no further fetch, so just simply replace the list for beneath 2 keys
            nodesList: mixedNodesList,
            notesNodes: resNotes.main.locationsList.concat(resNotes.main.topicsList),
            inspiredNodes: resInspired.main.locationsList.concat(resInspired.main.topicsList),
            nextFetchBasedTime: null,
            scrolled: false
          }
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

  _handleEnter_Btn(e){
    let nodeId = e.currentTarget.getAttribute('nodeid');
    this.setState({onBtn: nodeId});
  }

  _handleLeave_Btn(e){
    this.setState({onBtn: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { return dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedNodes));
