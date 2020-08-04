import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nodesSeriesList: [],
      nodesTypeMap: {},
      onMapNav: false,
      currentMouseOn: false
    };
    this._render_MapNav =this._render_MapNav.bind(this);
    this._render_NavBelongSeries = this._render_NavBelongSeries.bind(this);
    this._handleClick_navBelongSeries = this._handleClick_navBelongSeries.bind(this);
    this._handleClick_navBelongsMap = this._handleClick_navBelongsMap.bind(this);
    this._handleEnter_MapNav = this._handleEnter_MapNav.bind(this);
    this._handleLeave_MapNav = this._handleLeave_MapNav.bind(this);
    this._handleEnter_navLinkSeries = this._handleEnter_navLinkSeries.bind(this);
    this._handleLeave_navLinkSeries = this._handleLeave_navLinkSeries.bind(this);
    this._set_belongedToType = this._set_belongedToType.bind(this);
  }

  _handleClick_navBelongsMap(event){
    event.stopPropagation();
    event.preventDefault();
    let targetCat = event.currentTarget.getAttribute('valuetab');
    if(targetCat == this.props.currentTab) return;
    //only switch if the user had set
    if(targetCat in this.props.belongsByType) this.props._set_viewTab(targetCat);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.belongsByType.fetchedSeries && prevProps.belongsByType.fetchedSeries != this.props.belongsByType.fetchedSeries){
      this._set_belongedToType();
    }
  }

  componentDidMount(){
    this._set_belongedToType();
  }

  componentWillUnmount(){

  }

  _render_NavBelongSeries(){
    let navDOM = [];
    this.state.nodesSeriesList.forEach((nodeId, index)=>{
      if(this.props.currentNode== nodeId ) return ; // skip currentNode
      navDOM.push(
        <div
          key={'key_NavBelongSeries_' + nodeId}
          nodeid={nodeId}
          className={classnames(
            styles.boxNavLinkSeries
          )}
          onClick={this._handleClick_navBelongSeries}
          onMouseEnter={this._handleEnter_navLinkSeries}
          onMouseLeave={this._handleLeave_navLinkSeries}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span
                className={classnames(
                  styles.spanNavLinkSeries,
                  "fontContentPlain", "weightBold", "colorLightGrey",
                  {[styles.spanNavLinkSeriesMouse]: ( this.state.onLinkSeries == nodeId)}
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
            </div>
          }
        </div>
      );
    });
    return navDOM;
  }

  _render_MapNav(){
    if( !(this.props.currentNode in this.state.nodesTypeMap)) return ; // check if the map was standby

    let mapNovDOM = this.state.nodesTypeMap[this.props.currentNode].map((type, index)=>{
      return (
        <div
          key={"key_BelongsMapNav_typeMap_"+index}
          valuetab={type}
          className={classnames(
            styles.boxMapNavLink,
            {[styles.boxNavLinkMouse]: (this.state.onMapNav == type && this.props.currentTab != type)}
          )}
          onClick={this._handleClick_navBelongsMap}
          onMouseEnter={this._handleEnter_MapNav}
          onMouseLeave={this._handleLeave_MapNav}>
          <span
            className={classnames(
              'fontContentPlain',
              {
                ["colorWhiteGrey"]: (this.state.onMapNav != type && this.props.currentTab != type),
                ["weightBold"]: (this.props.currentTab != type),
                ["colorEditBlack"]: (this.state.onMapNav == type && this.props.currentTab != type),
                ["colorStandard"]: this.props.currentTab == type
              }
            )}>
            {this.props.i18nUIString.catalog['link_BelongsMap_Nav'][(type == "homeland") ? 0 : 1 ]}</span>
        </div>
      )
    });
    return mapNovDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavBelongsMap)}>
        <div
          className={classnames(styles.boxNavTitleSet)}>
          {(this.props.currentNode in this.props.nounsBasic) &&
            <div
              className={classnames(styles.boxNavCurrentTitle)}>
              <div
                className={classnames(styles.boxNavCurrentTitlePin)}>
                <SvgPin
                  mouseOn={true}
                  customStyles={{fillColor: 'rgba(84, 84, 84, 0.45)'}}/>
              </div>
              <span
                className={classnames(
                  styles.spanNavLinkSeries,
                  "fontTitle", 'lineHeight15', "colorEditBlack",
                )}>
                {this.props.nounsBasic[this.props.currentNode].name}</span>
            </div>
          }
          <div
            className={classnames(styles.boxNavTitle)}>
            {this._render_MapNav()}
          </div>
        </div>
        <div
          className={classnames(styles.boxNavColumn)}>
          <div>
            <div
              className={classnames(styles.boxNavTitleLower)}>
              {this._render_NavBelongSeries()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleClick_navBelongSeries(event){
    event.stopPropagation();
    event.preventDefault();
    let targetNode= event.currentTarget.getAttribute('nodeid');
    if(targetNode == this.props.currentNode) return; // no effect if clicked on the currentNode
    this.props._set_viewNode(targetNode);
    this.props._set_viewTab(this.state.nodesTypeMap[targetNode][0]); // set the tab to the first of its map
  }

  _handleEnter_MapNav(e){
    let currentMouseOn = e.currentTarget.getAttribute('valuetab');
    this.setState({onMapNav: currentMouseOn});
  }

  _handleLeave_MapNav(e){
    this.setState({onMapNav: false})
  }

  _handleEnter_navLinkSeries(e){
    let currentMouseOn = e.currentTarget.getAttribute('nodeid');
    this.setState({onLinkSeries: currentMouseOn});
  }

  _handleLeave_navLinkSeries(e){
    this.setState({onLinkSeries: false})
  }

  _set_belongedToType(){
    if( !this.props.belongsByType.fetched || !this.props.belongsByType.fetchedSeries) return ;

    let seriesList = []; // to save both serires as nest arr: [[ 'list homeland'], [ 'list residence']]
    let nodesList= [],
        nodesToType= {};
    // first, create seriesList by setTypesList, so the type order and the 'group' order would follow it.
    this.props.belongsByType.setTypesList.forEach((type, index) => {
      let series = (type == "homeland") ? "homelandup" : "residenceup";
      let typeList = this.props.belongsByType[series].listToTop.slice(); //shallow copy
      // then unshift the belong itself
      typeList.unshift(this.props.belongsByType[series].nodeId);
      typeList.reverse(); // reverse the typeList, the 'largest' administration would be the first
      seriesList.push(typeList);
    });
    /*
    then, loop the seriesList, and by each item in each sereis,
    compare to nodesList. If the item hasn't been in nodesList, unshift it.
    */
    seriesList.forEach((series, index) => {
      series.forEach((nodeId, i) => {
        if(nodesList.indexOf(nodeId) < 0){
          nodesList.unshift(nodeId);
          nodesToType[nodeId] = [this.props.belongsByType.setTypesList[index]];
        }
        else{
          nodesToType[nodeId].push(this.props.belongsByType.setTypesList[index]);
          return;
        };
      });
    });

    this.setState({
      nodesSeriesList: nodesList,
      nodesTypeMap: nodesToType
    });
  }

}

const mapStateToProps = (state)=>{
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
)(Nav));
