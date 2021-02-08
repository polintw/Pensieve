import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Belong from './Belong.jsx';

class BelongsbyType extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BelongList = this._render_BelongList.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_BelongList(){
    //category allow to used by this users, currently all the same
    const typeKeys = ["homeland", "residence"];

    const nodesDOM = typeKeys.map((nodeType, index)=>{
      return (
        <div
          key={"key_Belong_"+index}
          className={classnames(styles.boxBelong)}>
          <Belong
            type={nodeType}
            _set_Settingtype={this.props._set_Settingtype}
            _set_choiceAnType={this.props._set_choiceAnType}/>
        </div>
      )
    });

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongsbyType)}>
        {this._render_BelongList()}
        {
          (this.props.userInfo.accountStatus == "newly") &&
          <span
            className={classnames(
              styles.spanNewly,
              "colorEditLightBlack", "fontContent")}>
              {this.props.i18nUIString.catalog['hint_onBoard_belongEdit']}
          </span>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
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
)(BelongsbyType));
