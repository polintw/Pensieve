import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';
import SvgImgLayer from '../../../../Components/Svg/SvgIcon_imgLayer.jsx';

class BtnOpenMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
                  !!this.props.screenSize ? (!this.state.mouseOn ? {fillColor: "#b8b8b8"} : {fillColor: "#FFFFFF"}) : (!this.state.mouseOn ? {fillColor: "#a3a3a3"} : {fillColor: "#545454"})
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
                    stroke: !!this.props.screenSize ? (!this.state.mouseOn ? "#b8b8b8" : "#FFFFFF") : (!this.state.mouseOn ? "#a3a3a3" : "#545454"),
                    strokeWidth: "0.87px"
                  }} />
                <div
                  className={classnames("smallDisplayBox", styles.boxSmallDescrip)}>
                  <span
                    className={classnames("fontContentPlain", "lineHeight171")}
                    style={ this.state.mouseOn ? {color: '#545454'} : {color: '#a3a3a3'} }>
                    {this.props.i18nUIString.catalog['submit_Unit_PanelIcon'][0]}
                  </span>
                </div>
              </div>
          )
        }
      </div>
    )
  }

  _handleClick_Pin(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      mouseOn: false
    });
    this.props._set_frameView('map');
  }

  _handleClick_Arrow(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      mouseOn: false
    });
    this.props._set_frameView('img');
  }

  _handleEnter_Btn(e){
    this.setState({
      mouseOn: true
    })
  }

  _handleLeave_Btn(e){
    this.setState({
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
