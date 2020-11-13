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

    };
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
        <div>
              {
                  this.props.startListify &&
                  <div
                      className={classnames(styles.boxBtnOption)}
                      onClick={this._handleClick_switchStartList}>
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
                                          "fontContent", "colorAssistOcean")}>
                                      {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][0]}
                                  </span>
                              </div>
                          ) : (
                                  <div>
                                      <span
                                          className={classnames(
                                              "fontContent", "colorAssistOcean")}>
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
                      className={classnames(styles.boxBtnOption)}
                      onClick={this._handleClick_switchUppeLayer}>
                      <span
                          className={classnames(
                              "fontContent", "colorAssistOcean")}>
                          {"．"}
                          {this.props.i18nUIString.catalog['btn_nodesFilter_layerOptions'][2]}
                      </span>
                  </div>
              }
        </div>
        )
    }


    _handleClick_switchStartList(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props._set_switchStartList();
    }

    _handleClick_switchUppeLayer(event) {
        event.preventDefault();
        event.stopPropagation();
        // check first if there was a parent
        if (!this.props.baseParent) return;

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
