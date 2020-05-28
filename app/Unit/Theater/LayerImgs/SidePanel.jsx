import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../../stylesFont.module.css';
import AuthorPanel from './Author/AuthorPanel.jsx';
import {setUnitView} from "../../../redux/actions/unit.js";

class SidePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false,
    };
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleClick_UnitRespond = this._handleClick_UnitRespond.bind(this);
  }

  _handleEnter_Submit(e){
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    this.setState({
      onEnterSubmit: false
    })
  }

  _handleClick_UnitRespond(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_state_UnitView("respond");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=theater","unitView=respond");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div>
        {
          (this.props.unitCurrent.identity=="author") &&
          <AuthorPanel/>
        }
        {
          (this.props.unitCurrent.identity=="viewer") &&
          <div
            className={classnames(styles.btnSubmit)}
            style={Object.assign({},
              (this.state.onEnterSubmit)? {backgroundColor: "#ff8168", cursor: 'pointer'}:
              {backgroundColor: 'rgba(255, 129, 104, 0.1)'}
            )}
            onClick={this._handleClick_UnitRespond}
            onMouseEnter={this._handleEnter_Submit}
            onMouseLeave={this._handleLeave_Submit}>
            <span
              className={classnames(
                'centerAlignChild',
                stylesFont.fontSubmit,
                {[stylesFont.colorStandard]: (!this.state.onEnterSubmit)},
                {[stylesFont.colorWhite]: (this.state.onEnterSubmit)}
              )}>
              {this.props.i18nUIString.catalog["submit_respond"]}
            </span>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel));
