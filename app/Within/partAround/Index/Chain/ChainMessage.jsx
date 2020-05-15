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
    /*
    1) no shareds at all
    2) shareds but no responds, most common condition (perhap a greet)
    3) new shared, not a responds
    4) new shareds responds to primer
    5) responds to your shared
    6) responds to a responds
    */
    return (
      <div
        className={classnames(stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
        {}
      </div>
    )
  }

  render(){
    return(
      <div>
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
