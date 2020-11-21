import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

class LayerSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSpanResponds: false
    };
    this._handleClick_LinkListResponds = this._handleClick_LinkListResponds.bind(this);
    this._handleEnter_spanResponds = this._handleEnter_spanResponds.bind(this);
    this._handleLeave_spanResponds = this._handleLeave_spanResponds.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    return (this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) < 0) ? // guidingNails do not show the Respond & view responds
      (
        <span
          className={classnames(
            'fontContentPlain', styles.spanResponds,
            {
              [styles.spanRespondsActiv]: this.state.onSpanResponds,
              ['colorWhite']: this.state.onSpanResponds,
              ['colorEditBlack']: !this.state.onSpanResponds
            }
          )}
          onClick={this._handleClick_LinkListResponds}
          onMouseEnter={this._handleEnter_spanResponds}
          onMouseLeave={this._handleLeave_spanResponds}>
          {this.props.i18nUIString.catalog['link_UnitListResponds']}
        </span>
      ): null;
  }

  _handleClick_LinkListResponds(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_state_UnitView("related");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=theater","unitView=related");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
  }

  _handleEnter_spanResponds(e){
    this.setState({onSpanResponds: true})
  }

  _handleLeave_spanResponds(e){
    this.setState({onSpanResponds: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitSubmitting: state.unitSubmitting,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerSwitch));
