import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Invite from '../../../partAround/Index/Invite/Invite.jsx';
import CreateShare from '../../../../Unit/Editing/CreateShare.jsx';

class FeedEmpty extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onInvite: false
    };
    this._render_emptyButton =this._render_emptyButton.bind(this);
    this._handleEnter_Invite = this._handleEnter_Invite.bind(this);
    this._handleLeave_Invite = this._handleLeave_Invite.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_emptyButton(){
    const belongNodes = [this.props.belongsByType.homeland, this.props.belongsByType.residence];
    const nodeBelongify = belongNodes.indexOf(parseInt(this.props.nodeAtId)) < 0 ? false : true ;
    if(nodeBelongify){
      return (
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
                {this.props.i18nUIString.catalog["submit_"] }</span>
              <CreateShare
                {...this.props}
                _submit_Share_New={()=>{
                  // close the Create by rm creating in url, and then refresh page
                  let lastState = this.props.location.state.from ;
                  window.history.replaceState(lastState);
                  window.location.reload();}}/>
            </div>
        </div>
      );
    }
    else{
      return (
        <div
          className={classnames(styles.boxInvite)}>
          <Invite
            belongOnly={false}
            reqNode={this.props.nodeAtId}/>
        </div>
      )
    };
  }

  render(){
    return (
      <div className={styles.comFeedEmpty}>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          {this.props.i18nUIString.catalog['guiding_AtNode_noAccumulated']}
          <br/>
        </div>
        {
          this.props.belongsByType.fetched &&
          this._render_emptyButton()
        }
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
