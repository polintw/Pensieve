import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
//import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

class FixWidthDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames()}
        onClick={(e) => { /*NOTICE! Do not set stoppropagation() or prevetdefault on this component! <form>、<input> etc. inside any children need to propagete to browser.*/ }}>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(FixWidthDialog));
