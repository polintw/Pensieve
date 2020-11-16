import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavLayers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLayerSwitch: false,
      onStartSwitch: false
    };
    this._handleEnter_switchStart = this._handleEnter_switchStart.bind(this);
    this._handleLeave_switchStart = this._handleLeave_switchStart.bind(this);
    this._handleEnter_switchLayer = this._handleEnter_switchLayer.bind(this);
    this._handleLeave_switchLayer = this._handleLeave_switchLayer.bind(this);
    this._handleClick_switchStartList = this._handleClick_switchStartList.bind(this);
    this._handleClick_switchUppeLayer = this._handleClick_switchUppeLayer.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div
        className={classnames(styles.comNavLayer)}>
        {
          this.props.startListify &&
          <div
            className={classnames(styles.boxBtnOption)}
            onClick={this._handleClick_switchStartList}
            onMouseEnter={this._handleEnter_switchStart}
            onMouseLeave={this._handleLeave_switchStart}>
            {
              this.props.atStartListify ? (
                <div>
                  <span
                    className={classnames(
                      "fontContent", "colorEditBlack")}
                      style={{ marginRight: '4px' }}>
                    {this.props.i18nUIString.catalog['test_or_minor']}
                  </span>
                  <span
                    className={classnames(
                      "fontContent",
                      {["colorAssistOcean"]: !this.state.onStartSwitch},
                      {["colorStandard"]: this.state.onStartSwitch}
                    )}>
                    {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][0]}
                  </span>
                </div>
              ) : (
                <div>
                  <span
                    className={classnames(
                      "fontContent",
                      {["colorAssistOcean"]: !this.state.onStartSwitch},
                      {["colorStandard"]: this.state.onStartSwitch}
                    )}>
                    {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][1]}
                  </span>
                </div>
              )
            }
          </div>
        }
        {
          !this.props.atStartListify &&
          <div
            className={classnames(
              styles.boxBtnOption,
              {[styles.boxBtnOptionMouseon]: !this.props.baseParent}
            )}
            onClick={this._handleClick_switchUppeLayer}>
            <span
              className={classnames(
                "fontContent", "colorEditBlack",
                { ['colorWhiteGrey']: !this.props.baseParent } // if no parent
              )}
              style={{cursor: 'pointer'}}>
                {"．"}
            </span>
            <span
              className={classnames(
                "fontContent",
                { ['colorWhiteGrey']: (!this.props.baseParent)}, // if no parent
                {["colorStandard"]: (this.state.onLayerSwitch && this.props.baseParent)},
                {["colorAssistOcean"]: (!this.state.onLayerSwitch && this.props.baseParent)}
                )}
                onMouseEnter={this._handleEnter_switchLayer}
                onMouseLeave={this._handleLeave_switchLayer}>
                {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][2]}
              </span>
            </div>
          }
        </div>
      )
    }

    _handleEnter_switchLayer(e){
      this.setState((prevState, props)=>{
        return {
          onLayerSwitch: true
        }
      })
    }

    _handleLeave_switchLayer(e){
      this.setState((prevState, props)=>{
        return {
          onLayerSwitch: false
        }
      })
    }

    _handleEnter_switchStart(e){
      this.setState((prevState, props)=>{
        return {
          onStartSwitch: true
        }
      })
    }

    _handleLeave_switchStart(e){
      this.setState((prevState, props)=>{
        return {
          onStartSwitch: false
        }
      })
    }

    _handleClick_switchStartList(event) {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ // reset mouse event
          onStartSwitch: false
        });
        this.props._set_switchStartList();
    }

    _handleClick_switchUppeLayer(event) {
        event.preventDefault();
        event.stopPropagation();
        // check first if there was a parent
        if (!this.props.baseParent) return;

        this.setState({ // reset mouse event
          onLayerSwitch: false
        });
        this.props._set_switchUpperLayer();
    }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavLayers));
