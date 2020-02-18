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
    const typeKeys = Object.keys(this.state.typeObj);
    const nodesDOM = typeKeys.map((nodeType, index)=>{
      return (
        <div
          key={"key_Belong_"+index}
          className={classnames(styles.boxByType)}>
          <Belong
            {...this.state}
            type={nodeType}
            listIndex={index}
            _set_choiceAnType={this._set_choiceAnType}
            _refer_von_cosmic={this.props._refer_von_cosmic}/>
        </div>
      )
    });

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelong)}>
        {this._render_BelongList()}
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
)(BelongsbyType));
