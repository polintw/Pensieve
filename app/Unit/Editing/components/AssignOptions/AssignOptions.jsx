import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class AssignOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false
    };
    this._render_nodesOptions = this._render_nodesOptions.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodesOptions(){
    /* there is a period the typeKeys would be 'empty' at all: belongsByType not yet res.
    or ther parent list haven't res yet, also empty render */
    if( !this.props.belongsByType.fetched || !this.props.belongsByType.fetchedSeries) return [];

    let nodesList= []; // the main list we are going to render
    let series = (this.props.assignType == "homeland") ? "homelandup" : "residenceup"; // pick the nodes series from redux state
    nodesList = this.props.belongsByType[series].listToTop.slice(); //shallow copy
    // then unshift the belong itself(which was not in the 'listToTop')
    nodesList.unshift(this.props.belongsByType[series].nodeId);
    // reverse the typeList, the 'largest' administration would be the first, align to the last after render
    nodesList.reverse();

    // then simply loop the nodesList to render
    let nodesDOM =[];
    nodesList.forEach((nodeId, index)=>{
      let assigning = (this.props.allSelection.indexOf(nodeId) < 0) ? false : true;
      let selected = (nodeId == this.props.selected) ? false : true;

      nodesDOM.push(
        <li
          key={'_key_assignNode_' + index }
          nodeid={nodeId}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: assigning,
              [styles.mouseListItem]: (this.state.onNode == nodeId && !assigning)
            }
          )}
          onClick={this.}
          onMouseEnter={this._handleEnter_liItem}
          onMouseLeave={this._handleLeave_liItem}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span
                className={classnames(
                  styles.spanListItem, "fontContent",
                  {
                    ["colorGrey"]: !assigning && this.state.onNode != nodeId,
                    ["colorWhite"]: assigning || this.state.onNode == nodeId,
                    [styles.chosenSpanItem]: assigning,
                    [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                  }
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
              {
                !!this.props.nounsBasic[nodeId].prefix &&
                <span
                  className={classnames(
                    styles.spanListItem, "fontContent",
                    {
                      ["colorGrey"]: !assigning && this.state.onNode != nodeId,
                      ["colorWhite"]: assigning || this.state.onNode == nodeId,
                      [styles.chosenSpanItem]: assigning,
                      [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                    }
                  )}
                  style={{ alignSelf:'right', fontSize: '1.2rem'}}>
                  {", "+this.props.nounsBasic[nodeId].prefix}</span>
              }
            </div>
          }
        </li>
      );
    });

    return nodesDOM;
  }

  render(){
    return(
      <div>
        {this._render_nodesOptions()}
      </div>
    )
  }

  _handleEnter_liItem(e){
    this.setState({
      onNode: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_liItem(e){
    this.setState({
      onNode: ''
    })
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignOptions));
