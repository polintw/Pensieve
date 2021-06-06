import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SubcateBtnNext from '../Entity/SubcateBtnNext.jsx';
import {
  domain
} from '../../../config/services.js';

class PathSubcateCover extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onbtnContinue: false,
    };
    this._handleClick_linkStart = this._handleClick_linkStart.bind(this);
    this._handleEnter_btnStart = this._handleEnter_btnStart.bind(this);
    this._handleLeave_btnStart = this._handleLeave_btnStart.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let searchString = urlParams.toString();
    let sharedLink = domain.protocol+ '://'+domain.name + this.props.location.pathname;
    sharedLink = sharedLink + "?" + searchString;

    return(
      <div
        className={classnames(
          styles.comPathSubcateCover, styles.boxPathSubcateCenter)}>
        <div
          className={classnames(
            styles.boxPathSubcateBackBoard, styles.boxCover)}
          onClick={(event) => { event.stopPropagation(); }}>
          <div
            className={classnames(styles.boxCoverTtitle)}>
            <Link
              to={this.props.location}
              className={classnames('plainLinkButton')}
              style={{ display: 'inline-block', cursor: "text" }}>
              <span
                className={classnames(
                  "fontTitleBig",
                  styles.spanLinkSubcate,
                )}>
                {"@" + this.props.unitEntity.pathSubCate.currentSubcateObj["name"] + "!"}
              </span>
            </Link>
          </div>
          <div
            className={classnames(styles.boxCoverSubtitle)}>
            <span
              className={classnames("fontContentPlain", "colorWhite")}>
              {this.props.unitEntity.pathSubCate.currentSubcateObj['description']}
            </span>
          </div>
          <div
            className={classnames(styles.rowContinue)}>
            <div>
              <div
                title={this.props.i18nUIString.catalog["tagTitle_UnitSubcate_End_CopyBtn"]}
                className={classnames(
                  styles.boxNextBtn,
                  {[styles.boxNextBtnActiv]: this.state.onbtnContinue}
                )}
                onClick={this._handleClick_linkStart}
                onTouchStart={this._handleEnter_btnStart}
                onTouchEnd={this._handleLeave_btnStart}
                onMouseEnter={this._handleEnter_btnStart}
                onMouseLeave={this._handleLeave_btnStart}>
                <span
                  className={classnames(
                    "fontSubtitle_h5", "colorWhite",
                  )}>
                  {this.props.i18nUIString.catalog['submit_Enter']}
                </span>
                <div
                  className={classnames(styles.boxHiddenBtnNext)}>
                  <SubcateBtnNext
                    {...this.props}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleClick_linkStart(event){
    event.preventDefault();
    event.stopPropagation();
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because we are always in a Unit here
      search: urlParams.toString(),
      state: {from: this.props.location}
    });
  }

  _handleEnter_btnStart(e){
    this.setState({onbtnContinue: true})
  }

  _handleLeave_btnStart(e){
    this.setState({onbtnContinue: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitSubCate: state.unitSubCate
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PathSubcateCover));
