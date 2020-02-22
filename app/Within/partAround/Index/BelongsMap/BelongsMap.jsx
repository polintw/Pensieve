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
    let prevType = Object.keys(prevProps.belongsByType);
    let recordsType = Object.keys(this.props.belongsByType);
    if(prevType.length != recordsType.length){
      this.setState({viewTab: recordsType[0]});
    }
  }

  componentDidMount(){
    let recordsType = Object.keys(this.props.belongsByType);
    if(recordsType.length > 0){
      this.setState({viewTab: recordsType[0]});
    }
  }

  componentWillUnmount(){

  }

  _render_mapView(){
    switch (this.state.viewTab) {
      case 'homeland':
        return <FellowsHome/>
        break;
      case 'residence':
        return <FellowsResidence/>
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
        <div>
          <Nav
            _set_viewTab={this._set_viewTab}/>
        </div>
        <div>
          {
            this._render_mapView()
          }
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
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
