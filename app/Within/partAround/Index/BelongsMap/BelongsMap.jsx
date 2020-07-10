import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Nav from './Nav.jsx';
import FellowsHome from './FellowsHome.jsx';
import FellowsResidence from './FellowsResidence.jsx';
import Invite from '../Invite/Invite.jsx';

class BelongsMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      viewTab: "",
      viewNode: null
    };
    this._render_mapView = this._render_mapView.bind(this);
    this._set_viewTab = this._set_viewTab.bind(this);
    this._set_viewNode = this._set_viewNode.bind(this);
  }

  _set_viewTab(targetTab){
    this.setState({
      viewTab: targetTab
    })
  }

  _set_viewNode(targetNode){
    this.setState({
      viewNode: targetNode
    })
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    let recordsType = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    let prevRecordsType = !!prevProps.belongsByType.setTypesList? prevProps.belongsByType.setTypesList: [];
    let belongFlag = ()=>{ //check if any change at props.belongsByType
      if(recordsType.length != prevRecordsType.length) return true;
      let comparison = recordsType.some((type, index) => {
        if( !(type in prevProps.belongsByType)) return true;
        // if both this.props & prevProps has this type
        if( this.props.belongsByType[type] != prevProps.belongsByType[type]) return true;
        // if none of above
        return false;
      });
      return comparison;
    };
    if(belongFlag()){
      //not only refresh, but also re-render the FellowsHome/Residence
      this.setState({
        viewTab: (recordsType.indexOf("homeland")> (-1)) ? "homeland" : recordsType[0],
        viewNode: (recordsType.indexOf("homeland")> (-1)) ? this.props.belongsByType["homeland"] : this.props.belongsByType[recordsType[0]],
      });
    }
  }

  componentDidMount(){
    let recordsType = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    if(recordsType.length > 0){
      //depend on user's willing, we'd like to display "homeland" at the first glance,
      //but it might not be set by user.
      this.setState({
        viewTab: (recordsType.indexOf("homeland")> (-1)) ? "homeland" : recordsType[0],
        viewNode: (recordsType.indexOf("homeland")> (-1)) ? this.props.belongsByType["homeland"] : this.props.belongsByType[recordsType[0]],
      });
    }
  }

  componentWillUnmount(){

  }

  _render_mapView(){
    switch (this.state.viewTab) {
      case 'homeland':
        return (
          <div>
            <FellowsHome
              viewNode={this.state.viewNode}/>
          </div>
        )
        break;
      case 'residence':
        return (
          <div>
            <FellowsResidence
              viewNode={this.state.viewNode}/>
          </div>
        )
        break;
      default:
        return null
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongsMap)}>
        <div
          className={classnames(styles.boxNavBelongsMap)}>
          <Nav
            currentTab={this.state.viewTab}
            currentNode={this.state.viewNode}
            _set_viewNode={this._set_viewNode}
            _set_viewTab={this._set_viewTab}/>
        </div>
        <div
          className={classnames(styles.boxTabView)}>
          {
            this._render_mapView()
          }
        </div>
        <div
          className={classnames(styles.boxInvite)}>
          <div
            className={classnames(styles.boxInviteMapCorner) /*Important. keep this box under boxInvite to keep th btn at right but also follow the boxMapCorner*/ }>
            <Invite
              belongOnly={true}/>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
)(BelongsMap));
