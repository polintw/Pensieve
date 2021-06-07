import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class FeedEmpty extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comFeedEmpty}>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyNodesFeedIcon)}>
        </div>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontContent", "colorLightGrey")}>
          <span style={{display: 'inline-block', width: '212px'}}>
            {this.props.i18nUIString.catalog['guiding_noAccumulated_selfPageExplain'][3]}
          </span>
        </div>
      </div>
    )
  }

}


const mapStateToProps = (state)=>{
  return {
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
)(FeedEmpty));
