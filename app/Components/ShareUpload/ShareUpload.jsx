import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../Unit/Editing/CreateShare.jsx';

class ShareUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      onCreate: false,

    };
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
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
        className={classnames(
          styles.comShareUpload,
          {[styles.comMouseEnter]: this.state.onCreate}
        )}
        onMouseEnter={this._handleEnter_Upload}
        onMouseLeave={this._handleLeave_Upload}>
        <CreateShare
          forceCreate={this.state.editingOpen}
          _submit_Share_New={this.props._submit_Share_New}
          _refer_von_Create={this.props._refer_von_Create}/>
      </div>
    )
  }

  _handleEnter_Upload(e){
    this.setState({onCreate: true})
  }

  _handleLeave_Upload(e){
    this.setState({onCreate: false})
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
)(ShareUpload));
