import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavWalls from '../NavWalls/NavWalls.jsx';
import NotifyBell from '../../component/Notify/NotifyBell.jsx';

class NavCognitions extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_inCognition_: {
        width: '50vw',
        position: 'fixed',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box'
      },
    }
  }

  render(){
    return(
      <div>
        <div
          className={"selfFront-fixedBottomBox-height"}
          style={this.style.selfCom_NavsCognition_inCognition_}>
          <div className={classnames(styles.boxTongue)}/>
          <div
            className={classnames(styles.boxOptions)}>
            <NavWalls {...this.props} />
            <div style={{height: '90%', borderRight: 'solid 1.5px #a0a0a0'}}/>
            <NotifyBell/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavCognitions));
