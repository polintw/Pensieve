import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ModalEmit from '../ModalEmit/ModalEmit.jsx';
import SvgPin from '../Svg/SvgPin.jsx';

class BtnOpenMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      mouseOn: false,
    };
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
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
        className={classnames(styles.comBtnOpenMap)}>
        <a
          href={"https://www.google.com/maps/search/?api=1&query=" + this.props.latitude + "%2C" /* comma specify by Google*/ + this.props.longitude}
          className={classnames("plainLinkButton", styles.boxSvgIcon)}
          target={"_blank"}
          onMouseEnter={this._handleEnter_Btn}
          onMouseLeave={this._handleLeave_Btn}>
          <SvgPin
            assignStyles={{
              fill: "transparent",
              stroke: this.state.mouseOn ? '#ff8168': '#a3a3a3',
              strokeWidth: "0.87px"
              }}/>
        </a>
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

  _handleEnter_Btn(e){
    this.setState({
      emit: { text: this.props.i18nUIString.catalog["message_btn_OpenMap"] },
      mouseOn: true
    })
  }

  _handleLeave_Btn(e){
    this.setState({
      emit: false,
      mouseOn: false
    })
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
)(BtnOpenMap));
