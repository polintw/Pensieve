import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ModalEmit from '../../../../Components/ModalEmit/ModalEmit.jsx';
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';
import SvgImgLayer from '../../../../Components/Svg/SvgIcon_imgLayer.jsx';

class BtnOpenMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      mouseOn: false,
    };
    this._handleClick_Arrow = this._handleClick_Arrow.bind(this);
    this._handleClick_Pin = this._handleClick_Pin.bind(this);
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
        {
          (this.props.frameView == "map") ?  (
            <div
              className={classnames(styles.boxSvgIcon)}
              onClick={this._handleClick_Arrow}
              onTouchStart={this._handleEnter_Btn}
              onTouchEnd={this._handleLeave_Btn}
              onMouseEnter={this._handleEnter_Btn}
              onMouseLeave={this._handleLeave_Btn}>
              <SvgImgLayer
                customStyles={
                  this.state.mouseOn ? {fillColor: "#ff8168"} : {fillColor: "#a3a3a3"}
                } />
            </div>
          ) : (
              <div
                className={classnames(styles.boxSvgIcon)}
                onClick={this._handleClick_Pin}
                onTouchStart={this._handleEnter_Btn}
                onTouchEnd={this._handleLeave_Btn}
                onMouseEnter={this._handleEnter_Btn}
                onMouseLeave={this._handleLeave_Btn}>
                <SvgPin
                  assignStyles={{
                    fill: "transparent",
                    stroke: this.state.mouseOn ? '#ff8168' : '#a3a3a3',
                    strokeWidth: "0.87px"
                  }} />
              </div>
          )
        }
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

  _handleClick_Pin(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_frameView('map');
  }

  _handleClick_Arrow(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_frameView('img');
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
