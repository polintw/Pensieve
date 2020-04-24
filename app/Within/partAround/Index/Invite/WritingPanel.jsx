import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class WritingPanel extends React.Component {
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
        className={classnames()}>


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
)(WritingPanel));
