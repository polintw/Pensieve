import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ModalEmit from '../ModalEmit/ModalEmit.jsx';
import SvgCopyLink from '../Svg/SvgIcon_CopyLink.jsx';

class LinkCopy extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      emitTimeOut: false,
      mouseOn: false,
      hiddenUrl: ''
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
    this._handleClick_CopyLink = this._handleClick_CopyLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let href = window.location.href;
    if( href != prevState.hiddenUrl){
      let href = window.location.href;
      this.setState({hiddenUrl: href});
    };
  }

  componentDidMount() {
    // the most important function of this comp. is to 'copy' the current url
    let href = window.location.href;
    this.setState({hiddenUrl: href});
  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comLinkCopy)}>
        <div style={{width:"100%",position: 'absolute', overflow:'hidden'}}>
          <input
            ref={this.refHiddenText}
            className={classnames(styles.boxHiddenText)}
            value={this.state.hiddenUrl}
            readOnly/>
        </div>
        <div
          className={classnames(styles.boxSvgIcon)}
          onMouseEnter={this._handleEnter_Btn}
          onMouseLeave={this._handleLeave_Btn}
          onClick={this._handleClick_CopyLink}>
          <SvgCopyLink
            mouseReact={this.state.mouseOn}/>
        </div>
        {
          this.state.emit &&
          <div
            className={classnames(styles.boxModalEmit)}>
            <ModalEmit
              text={this.state.emit.text} />
          </div>
        }
      </div>
    )
  }

  _set_emitModal(){
    this.setState({
      emitTimeOut: true,
      emit: { text: this.props.i18nUIString.catalog["message_Unit_LinkCopy"]}
    });
    this.modalTimeOut = setTimeout(()=>{
      this.setState((prevState, props)=>{
        return {
          emitTimeOut: false,
          emit:false
        }
      })
    }, 2200)
  }

  _handleClick_CopyLink(e){
    e.stopPropagation();
    e.preventDefault();

    this.refHiddenText.current.select();
    document.execCommand('copy'); // had completed copy to clipboard
    // than inform the user by emitModal
    // and to ensure the 'emitModal' mount again, reset state before set emit text
    this.setState((prevState, props)=>{
      if(this.state.emitTimeOut) clearTimeout(this.modalTimeOut);
      return {emit: false, emitTimeOut: false};
    }, ()=>{ this._set_emitModal(); })
  }

  _handleEnter_Btn(e){
    this.setState((prevState, props)=>{
      // make sure everything was re-set
      if(this.state.emitTimeOut) clearTimeout(this.modalTimeOut);
      return {emit: false, emitTimeOut: false};
    }, ()=>{
      this.setState({
        emit: { text: this.props.i18nUIString.catalog["tagTitle_Unit_LinkCopy"] },
        mouseOn: true
      });
    });
  }

  _handleLeave_Btn(e){
    this.setState((prevState, props)=>{
      let timeOutDepend = prevState.emitTimeOut ? {} : {emit: false};
      let nextState = Object.assign({
        mouseOn: false
      }, timeOutDepend);

      return nextState;
    });
  }

}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkCopy));
