import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import AuthorPanel from './Author/AuthorPanel.jsx';

class SidePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div>
        {
          (this.props.unitCurrent.identity=="author") &&
          <AuthorPanel/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel));
