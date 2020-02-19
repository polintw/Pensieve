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
    const typeKeys = Object.keys(this.props.belongsByType);
    const nodesDOM = typeKeys.map((nodeType, index)=>{
      return (
        <div
          key={"key_Belong_"+index}
          className={classnames(styles.boxByType)}>
          <Belong
            type={nodeType}
            nodeId={this.props.belongsByType[nodeType]}
            _set_searchModal={this.props._set_searchModal}/>
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