import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedNodes from './FeedNodes/FeedNodes.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedPosition: null
    };
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
        className={classnames(styles.comAtNode)}>
        <div
          className={classnames(styles.boxTopTitle)}>
          <div
            className={classnames(styles.boxNodeTitle)}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.props.i18nUIString.catalog['tab_Nodes']}
            </span>
          </div>
          <div>
            <span
              className={classnames("fontContentPlain", "colorEditBlack")}>
              {this.props.i18nUIString.catalog['subTitle_ComiscNodes_']}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxFeedNodes)}>
          <FeedNodes
            {...this.props}/>
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
)(Wrapper));
