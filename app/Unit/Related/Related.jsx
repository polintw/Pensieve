import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import RelatedList from '../RelatedList/RelatedList.jsx';
import RelatedOrigin from '../RelatedOrigin/RelatedOrigin.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';

const styleMiddle = {

}

class Related extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSpanBack: false
    };
    this._handleEnter_spanBack = this._handleEnter_spanBack.bind(this);
    this._handleLeave_spanBack = this._handleLeave_spanBack.bind(this);
    this.style={

    }
  }

  _handleEnter_spanBack(e){
    this.setState({
      onSpanBack: true
    })
  }

  _handleLeave_spanBack(e){
    this.setState({
      onSpanBack: false
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState({from: this.props.location}, '', '/cosmic/explore/unit?unitId='+this.unitId);
  }

  componentDidMount(){
    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState({from: this.props.location}, '', '/cosmic/explore/unit?unitId='+this.unitId);
  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');

    return(
      <div
        className={classnames(styles.comRelated)}>
        <div
          className={classnames(styles.boxTop)}>
          <RelatedOrigin
            {...this.props}/>
        </div>
        <div
          className={classnames(styles.boxUnder)}>
          <div
            className={classnames(styles.boxSubtitle, styles.fontSubtitle)}>
            <span
              style={{position: 'sticky',top: '27%'}}>
              {"connect to more"}<br/>{'from'}</span>
            <div
              className={classnames(styles.boxLeaveSet)}>
              <div
                className={classnames(styles.boxLogo)}
                onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/cosmic')}}>
                <SvgLogo/>
              </div>
              <div
                className={classnames(styles.boxBack)}
                onMouseEnter={this._handleEnter_spanBack}
                onMouseLeave={this._handleLeave_spanBack}>
                <span
                  className={classnames(styles.spanBack)}
                  style={this.state.onSpanBack?{color: '#111111'}:{}}
                  onClick={(e)=>{e.stopPropagation();e.preventDefault();this.props._handleClick_leave();}}>
                  {" ╳ "}
                </span>
              </div>
            </div>
          </div>
          <div
            className={classnames(styles.boxList)}>
            <RelatedList
              {...this.props}
              unitId={this.unitId}/>
          </div>
        </div>
        <div
          className={styles.footer}>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Related));
