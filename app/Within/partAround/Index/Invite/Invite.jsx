import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import WritingPanel from './WritingPanel.jsx';
import stylesFont from '../../stylesFont.module.css';
import ModalBox from '../../../../Components/ModalBox.jsx';
import ModalBackground from '../../../../Components/ModalBackground.jsx';
import FixWidthDialog from '../../../../Components/Dialog/CustomDialog/FixWidthDialog.jsx';

class Invite extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      panelModal: false,
      onInvite: false
    };
    this._set_Dialog = this._set_Dialog.bind(this);
    this._handleClick_inviteModal = this._handleClick_inviteModal.bind(this);
    this._handleEnter_Invite = this._handleEnter_Invite.bind(this);
    this._handleLeave_Invite = this._handleLeave_Invite.bind(this);
    this._switchState_panelModal = (bool)=>{this.setState({panelModal: bool})};
  }

  _handleClick_inviteModal(event){
    event.preventDefault();
    event.stopPropagation();
    this._switchState_panelModal(true);
  }

  _set_Dialog(){
    this._switchState_panelModal(false);
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
          className={classnames(
            styles.boxBtnInvite,
            {[styles.boxBtnInviteActiv]: this.state.onInvite}
          )}
          onClick={this._handleClick_inviteModal}
          onMouseEnter={this._handleEnter_Invite}
          onMouseLeave={this._handleLeave_Invite}>
          <span
            className={classnames(
              styles.spanBtnInvite,
              {
                ['colorGrey']: !this.state.onInvite,
                ['colorWhite']: this.state.onInvite,
              }, 'fontSubtitle_h5')}>
            {
              this.props.belongOnly?
              this.props.i18nUIString.catalog["submit_Invite_"]:
              this.props.i18nUIString.catalog["submit_Invite_people"]
            }</span>
        </div>
        {
          this.state.panelModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <FixWidthDialog>
                <WritingPanel
                  belongOnly={this.props.belongOnly}
                  reqNode={!!this.props.reqNode ? this.props.reqNode: null}
                  onComplete={this._set_Dialog}/>
              </FixWidthDialog>
            </ModalBackground>
          </ModalBox>
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
)(Invite));
