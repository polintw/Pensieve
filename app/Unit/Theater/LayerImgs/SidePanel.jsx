import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import AuthorPanel from '../components/Author/AuthorPanel.jsx';
import {setUnitView} from "../../../redux/actions/unit.js";

class SidePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_UnitRespond = this._handleClick_UnitRespond.bind(this);
  }

  _handleClick_UnitRespond(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_state_UnitView("respond");
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={styles.comSidePanel}>
        {
          (this.props.unitCurrent.identity=="author") &&
          <AuthorPanel/>
        }
        {
          (this.props.unitCurrent.identity=="viewer") &&
          <div
            onClick={this._handleClick_UnitRespond}>
            {"create new"}</div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel));
