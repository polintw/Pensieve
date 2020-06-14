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
      viewTab: ""
    };
    this._render_mapView = this._render_mapView.bind(this);
    this._set_viewTab = this._set_viewTab.bind(this);
  }

  _set_viewTab(targetTab){
    this.setState({
      viewTab: targetTab
    })
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    let recordsType = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    let prevRecordsType = !!prevProps.belongsByType.setTypesList? prevProps.belongsByType.setTypesList: [];
    if(prevRecordsType.length != recordsType.length){
      //depend on user's willing, we'd like to display "homeland" at the first glance,
      //but it might not be set by user.
      this.setState({viewTab: (recordsType.indexOf("homeland")> (-1)) ? "homeland" : recordsType[0]});
    }
  }

  componentDidMount(){
    let recordsType = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    if(recordsType.length > 0){
      //depend on user's willing, we'd like to display "homeland" at the first glance,
      //but it might not be set by user.
      this.setState({viewTab: (recordsType.indexOf("homeland")> (-1)) ? "homeland" : recordsType[0]});
    }
  }

  componentWillUnmount(){

  }

  _render_mapView(){
    switch (this.state.viewTab) {
      case 'homeland':
        return (
          <div>
            <FellowsHome/>
          </div>
        )
        break;
      case 'residence':
        return (
          <div>
            <FellowsResidence/>
          </div>
        )
        break;
      default:
        return (
          <div>{this.props.i18nUIString.catalog["guidingBelongs_EmptyMap"]}</div>
        )
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
          <Invite/>
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
