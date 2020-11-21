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
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          {this.props.i18nUIString.catalog['guiding_AtNode_noAccumulated']}
          <br/>
        </div>

      </div>
    )
  }

}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
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
)(FeedEmpty));
