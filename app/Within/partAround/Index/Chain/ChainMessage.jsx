import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';

class ChainMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_HintMessage = this._render_HintMessage.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_HintMessage(){
    return (
      <div
        className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
        {}
      </div>
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.comChainMessage)}>
        {this._render_HintMessage()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    chainList: state.chainList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChainMessage));
