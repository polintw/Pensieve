import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ShareUpload from '../../../../Components/ShareUpload/ShareUpload.jsx';

class IndexShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comShareUpload)}>
        <ShareUpload
          {...this.props}
          _submit_Share_New={this._submit_Share_New}
          _refer_von_Create={this.props._refer_von_cosmic}/>
      </div>
    )
  }

  _submit_Share_New(){
    // and remember the editing modal was opened by URL change
    let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
    this.props.history.replace({
      pathname: lastState.pathname,
      search: lastState.search,
      state: lastState.state
    });
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
)(IndexShare));
