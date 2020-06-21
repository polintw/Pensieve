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

    };
    this._render_emptyButton =this._render_emptyButton.bind(this);
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
                  ['colorWhite']: this.state.onInvite,
                }, 'fontSubtitle_h5')}>
                {this.props.i18nUIString.catalog["submit_"] }</span>
              <CreateShare
                {...this.props}/>
            </div>
        </div>
      );
    }
    else{
      return (
        <div
          className={classnames(styles.boxInvite)}>
          <Invite/>
        </div>
      )
    };
  }

  render(){
    return (
      <div>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned'][0]}
          <br/>
          {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned'][1]}
        </div>
        {
          this.props.belongsByType.fetched &&
          this._render_emptyButton()
        }
      </div>
    )
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
