import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_get_Suggestions
} from './axios.js';
import {
  handleNounsList,
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class SuggestNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      suggestions: [],
      overBtnNodes: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleOut_nodes = this._handleOut_nodes.bind(this);
    this._handleOver_nodes = this._handleOver_nodes.bind(this);
    this._render_suggestNodes = this._render_suggestNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // reset suggestions list if the path change
    if ((this.props.listIdentity != prevProps.listIdentity) || (this.props.listLocation != this.props.listLocation) ){
      this._set_suggestionsList();
    };
  }

  componentDidMount(){
    this._set_suggestionsList();
  }

  componentWillUnmount(){

  }

  _render_suggestNodes(){
    let nodesDOM = this.state.suggestions.map((nodeId, index)=>{
      return (
        <div
          key={"key_NavFilter_sugeestionsNodes_"+index}
          nodeid={nodeId}
          style={{marginBottom: '1px'}}
          onMouseOver={this._handleOver_nodes}
          onMouseOut={this._handleOut_nodes}>
          {
            (nodeId in this.props.nounsBasic) &&
            <Link
              to={{
                pathname: this.props.match.url,
                search: '?filterNode=' + nodeId,
                state: { from: this.props.location }
              }}
              className={classnames(
                'plainLinkButton', styles.linkNodeSuggest,
                {
                  ["colorGrey"]: (this.state.overBtnNodes != nodeId),
                  ["colorWhite"]: (this.state.overBtnNodes == nodeId),
                  [styles.mouseovLinkNodeSuggest]: (this.state.overBtnNodes == nodeId)
                }
              )}>
              <div>
                <span
                  className={classnames(
                    "fontContent", "weightBold",
                  )}>
                  {this.props.nounsBasic[nodeId].name}
                </span>
                {
                  (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                  <span
                    className={classnames(
                      "fontTitleSmall", "weightBold",
                    )}>
                    {", "}
                  </span>
                }
                {
                  (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                  <span
                    className={classnames(
                      "fontTitleSmall", "weightBold",
                    )}>
                    {this.props.nounsBasic[nodeId].prefix}
                  </span>
                }
              </div>
            </Link>
          }
        </div>
      )
    });

    return nodesDOM;
  }


  render(){
    return (
      <div
        className={classnames(styles.boxFilterSuggest)}>
        {this._render_suggestNodes()}
      </div>
    )
  }

  _set_suggestionsList(){
    const self = this;
    this.setState({axios: true});
    let paramsObj = {
      originList: this.props.listLocation,
      listIdentity: this.props.listIdentity // pathName, or userId
    };

    _axios_get_Suggestions(this.axiosSource.token, paramsObj)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          suggestions: resObj.main.nodesList,
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

  _handleOver_nodes(event) {
    let nodeId = event.currentTarget.getAttribute('nodeid');
    this.setState({ overBtnNodes: nodeId })
  }

  _handleOut_nodes(event) {
    this.setState({ overBtnNodes: false })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
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
)(SuggestNodes));
