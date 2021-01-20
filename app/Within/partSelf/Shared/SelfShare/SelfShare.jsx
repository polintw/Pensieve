import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ShareUpload from '../../../../Components/ShareUpload/ShareUpload.jsx';

class SelfShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseEnter: false
    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleEnter_Share = this._handleEnter_Share.bind(this);
    this._handleLeave_Share = this._handleLeave_Share.bind(this);
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
          {/* keep this box(line) to mirror the one used in Index */}
        </div>
        <div
          className={classnames(styles.boxShareUpload)}
          onMouseEnter={this._handleEnter_Share}
          onMouseLeave={this._handleLeave_Share}>
          <ShareUpload
            {...this.props}
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>

      </div>
    )
  }

  _handleEnter_Share(e){
    this.setState({mouseEnter: true})
  }

  _handleLeave_Share(e){
    this.setState({mouseEnter: false})
  }

  _submit_Share_New(resNewUnit){
    // and remember the editing modal was opened by URL change
    let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
    this.props.history.replace({
      pathname: lastState.pathname,
      search: lastState.search,
      state: lastState.state
    });
    // now, reload or go to page by authorIdentity in res
    let path = '/self/shareds' + ( resNewUnit.authorIdentity == "userAccount" ? '' : ('/' + 'pathProject') );
    let paramComparison = (resNewUnit.authorIdentity == "userAccount") ? 'shareds' : 'pathProject';
    // 'go to' or 'stay & reload'
    (this.props.lastParam == paramComparison) ? window.location.reload() :
    window.location.assign(path);
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
)(SelfShare));
