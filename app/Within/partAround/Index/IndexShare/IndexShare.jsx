import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import ShareUpload from '../../../../Components/ShareUpload/ShareUpload.jsx';

class IndexShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseEnter: false
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.boxGuiding)}>
          <span
            className={classnames(stylesFont.fontContent, stylesFont.colorStandard)}>
            {this.props.i18nUIString.catalog["guiding_AroundIndex_Share"]}</span>
        </div>
        <div
          className={classnames(styles.boxShareUpload)}>
          <ShareUpload
            _submit_Share_New={this.props._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
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
)(IndexShare));
