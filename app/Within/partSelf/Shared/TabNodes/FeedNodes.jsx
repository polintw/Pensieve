import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedNodesEmpty from './FeedNodesEmpty.jsx';
import {_locationsNodes_levelHandler} from './utils.js';
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
      batchedLocationsNodes: [],
      cateLocationsNodes: [],
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
        batchedLocationsNodes: [],
        cateLocationsNodes: [],
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
    const _nodes_DOM = (nodeId)=>{
      let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
      toSearch.set("filterNode", nodeId);
      let linkObj = {
        pathname: this.props.location.pathname,
        search: toSearch.toString(),
        state: {from: this.props.location}
      };

      return (
        <Link
          key={"key_NodeFeed_new_"+nodeId}
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
      )
    }
    const _nodes_ByLevel = (nodesGroup, groupIndex)=>{
      let nodesDOM = [];
      nodesGroup.forEach((nodeSet, setIndex) => {
        let setKeys = Object.keys(nodeSet);
        setKeys.forEach((key, keyIndex) => {
          nodeSet[key].forEach((nodeId, index) => {
            //render if there are something in the data
            if( !(nodeId in this.props.nounsBasic)) return; //skip if the info of the unit not yet fetch
            nodesDOM.push (_nodes_DOM(nodeId));
          });
        });
      });

      return nodesDOM;
    };
    const _nodesByGroup = (nodesGroup, groupIndex)=>{
      let nodesDOM = [];
      nodesGroup.forEach((nodeId, index) => {
        //render if there are something in the data
        if( !(nodeId in this.props.nounsBasic)) return; //skip if the info of the unit not yet fetch
        nodesDOM.push (_nodes_DOM(nodeId));
      });

      return nodesDOM;
    };

    this.state[nodesCategory].forEach((nodesGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_PathProject_nodesGroup"+index}
          className={classnames(
            styles.boxModuleCenter,
          )}>
          {
            nodesCategory == 'cateLocationsNodes' ?
            _nodes_ByLevel(nodesGroup, index) :
            _nodesByGroup(nodesGroup, index)
          }
        </div>
      );
    });

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
              (this.state.cateTopicsNodes.length > 0 && this.state.cateLocationsNodes.length > 0) &&
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
      return self.props._submit_NounsList_new(mixedNodesList)
      .then(()=>{
        self.setState((prevState, props)=>{
          // to make list by batch time
          let copiedBatchLocationsNodes = prevState.batchedLocationsNodes.slice();
          if(mixedLocationsNodes.length > 0) copiedBatchLocationsNodes.push(mixedLocationsNodes);
          let copiedTopicsNodes = prevState.cateTopicsNodes.slice();
          if(mixedTopicsNodes.length > 0) copiedTopicsNodes.push(mixedTopicsNodes);
          // to make the locationsList has level seperate
          let allLocationsList = [];
          copiedBatchLocationsNodes.forEach((locationsNodesGroup, indexGroup) => {
            allLocationsList = allLocationsList.concat(locationsNodesGroup);
          });
          let cateLocationsNodes =  _locationsNodes_levelHandler(allLocationsList, this.props.nounsBasic);

          return {
            axios: false,
            cateLocationsNodes: [cateLocationsNodes], // make a 'array' just to follow the batch form usually used
            cateTopicsNodes: copiedTopicsNodes,
            batchedLocationsNodes: copiedBatchLocationsNodes,
            // now we fetch the list all at once, no further fetch, so just simply replace the list for beneath 2 keys
            nodesList: mixedNodesList,
            notesNodes: resNotes.main.locationsList.concat(resNotes.main.topicsList),
            inspiredNodes: resInspired.main.locationsList.concat(resInspired.main.topicsList),
            nextFetchBasedTime: null,
            scrolled: false
          }
        });
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
