import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import commonStyles from "./commonStyles.module.css";

class CustomDialog extends React.Component {
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
        className={classnames(commonStyles.comCustomDialog)}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
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
)(CustomDialog));
