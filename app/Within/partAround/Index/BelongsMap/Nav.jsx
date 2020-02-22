import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_navBelongsMap = this._handleClick_navBelongsMap.bind(this);
  }

  _handleClick_navBelongsMap(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_viewTab(event.currentTarget.getAttribute('valuetab'));
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comNavBelongMap)}>
        <div
          valuetab={"homeland"}
          onClick={this._handleClick_navBelongsMap}>
          <span>{this.props.i18nUIString.catalog['link_BelongsMap_Nav'][0]}</span>
          <span>{this.props.i18nUIString.catalog['link_BelongsMap_Nav'][1]}</span>
        </div>
        <div
          valuetab={"residence"}
          onClick={this._handleClick_navBelongsMap}>
          <span>{this.props.i18nUIString.catalog['link_BelongsMap_Nav'][0]}</span>
          <span>{this.props.i18nUIString.catalog['link_BelongsMap_Nav'][2]}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
