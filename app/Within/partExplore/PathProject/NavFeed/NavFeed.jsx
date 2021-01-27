import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavBtnRow from '../../../../Components/NavFilter/NavBtnRow.jsx';

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSwitch: false
    };
    this._handleEnter_switchFilter = this._handleEnter_switchFilter.bind(this);
    this._handleLeave_switchFilter = this._handleLeave_switchFilter.bind(this);
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
        className={classnames(styles.comNavFeed)}>
        <div>
          <span
            className={classnames(
              "fontContentPlain", "weightBold", "colorAssistGold")}>
            { this.props.i18nUIString.catalog["title_NavAtNode_"] }
          </span>
        </div>
        <div>
          <div>
            <span
              btn={"image"}
              className={classnames(
                "fontContent",
                {["colorAssistOcean"]: (this.state.onSwitch != 'image')},
                {["colorStandard"]: (this.state.onSwitch == 'image')}
              )}
              onMouseEnter={this._handleEnter_switchFilter}
              onMouseLeave={this._handleLeave_switchFilter}>

              {this.props.i18nUIString.catalog['btn_filteNav_Feed'][0]}
            </span>
            <span
              className={classnames(
                "fontContent", "colorEditBlack")}
              style={{cursor: 'text'}}>
                {"．"}
            </span>
            <span
              btn={"map"}
              className={classnames(
                "fontContent",
                {["colorAssistOcean"]: (this.state.onSwitch != 'map')},
                {["colorStandard"]: (this.state.onSwitch == 'map')}
                )}
              onMouseEnter={this._handleEnter_switchFilter}
              onMouseLeave={this._handleLeave_switchFilter}>
              {this.props.i18nUIString.catalog['btn_filteNav_Feed'][1]}
            </span>
          </div>
          <NavBtnRow
            {...this.props}
            viewFilter={this.props.viewFilter}
            _set_viewFilter={this.props._set_viewFilter}/>
        </div>
      </div>
    )
  }

  _handleEnter_switchFilter(e){
    let currentBtn = event.currentTarget.getAttribute('btn');
    this.setState((prevState, props)=>{
      return {
        onSwitch: currentBtn
      }
    })
  }

  _handleLeave_switchFilter(e){
    this.setState((prevState, props)=>{
      return {
        onSwitch: false
      }
    })
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavFeed));
