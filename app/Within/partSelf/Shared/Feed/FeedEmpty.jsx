import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../../../Unit/Editing/CreateShare.jsx';

class FeedEmpty extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onInvite: false
    };
    this._handleEnter_Invite = this._handleEnter_Invite.bind(this);
    this._handleLeave_Invite = this._handleLeave_Invite.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comFeedEmpty}>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          {this.props.i18nUIString.catalog['guiding_noAccumulated_shareInvitation']}
          <br/>
        </div>
        <div
          className={classnames(styles.boxInvite)}>
          <div
            className={classnames(
              styles.boxBtnInvite,
              {[styles.boxBtnInviteActiv]: this.state.onInvite}
            )}
            onMouseEnter={this._handleEnter_Invite}
            onMouseLeave={this._handleLeave_Invite}>
            <span
              className={classnames(
                styles.spanBtnInvite,
                {
                  ['colorGrey']: !this.state.onInvite,
                  ['colorStandard']: this.state.onInvite,
                }, 'fontSubtitle_h5')}>
              {this.props.i18nUIString.catalog["title_share"] }</span>
            <CreateShare
                {...this.props}
                _submit_Share_New={()=>{
                  // close the Create by rm creating in url, and then refresh page
                  let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
                  urlParams.delete('creating');
                  window.history.replaceState({
                    pathname: this.props.match.path,
                    search: urlParams.toString(),
                    state: {from: this.props.location}
                  });
                  window.location.reload();}}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          <span style={{display: 'inline-block', width: '170px'}}>
            {this.props.i18nUIString.catalog['guiding_noAccumulated_selfPageExplain'][1]}
          </span>
          <br/>
        </div>
      </div>
    )
  }

  _handleEnter_Invite(e){
    this.setState({onInvite: true})
  }

  _handleLeave_Invite(e){
    this.setState({onInvite: false})
  }

}


const mapStateToProps = (state)=>{
  return {
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
)(FeedEmpty));
