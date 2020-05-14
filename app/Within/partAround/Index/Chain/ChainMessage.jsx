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

  _render_HintMessage(recKeys){
    if(recKeys.length == 0){ // if no belongsByType was set
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          {this.props.i18nUIString.catalog["guidingChain_noBelongSet"]}
        </div>
      )
    } else if (this.props.chainList.listOrderedChain.length < 1 && recKeys.length >0){
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          <span>{this.props.i18nUIString.catalog["guidingChain_noSharedEst."][0]}</span>
        </div>
      )
    }else{
      return null
    }
  }

  render(){
    const recKeys = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    return(
      <div
        className={classnames(styles.comChainMessage)}>
        {this._render_HintMessage(recKeys)}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
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
