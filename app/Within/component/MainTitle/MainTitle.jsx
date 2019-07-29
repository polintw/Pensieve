import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';
import {
  setCosmicTitle
} from "../../../redux/actions/general.js";

class MainTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.boxTitle = React.createRef();
    this._check_Position = this._check_Position.bind(this);
    this.style={
      withinCom_MainIndex_scroll_col_logo: {
        display: 'inline-block',
        height: '94%',
        position: 'relative',
        top: '1%',
        boxSizing: 'border-box',
        margin: '0px 50% 0 9%'
      }

    }
  }

  _check_Position(){
    let titleTop = this.boxTitle.current.getBoundingClientRect().top;
    //due to this answer[https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than]
    //if else should be the fastest way

    //1 after < scrollLine
    if(this.props.mainTitle < 1 && titleTop < this.scrollLine){
      this.props._set_title_topRatio(1);
    }
    else if(titleTop < this.scrollOrigin && titleTop > this.scrollLine){
      let ratio = (this.scrollOrigin-titleTop)/this.scrollRange;
      this.props._set_title_topRatio(ratio);
    }
    //always 0 if at the top view
    else if(this.props.mainTitle > 0 && titleTop > this.scrollLine){
      this.props._set_title_topRatio(0);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    //beneath, base on the static of the height of the Tilte, now is 83px limited by MainIndex
    this.scrollOrigin = (this.boxTitle.current.getBoundingClientRect().top-40);
    this.scrollRange = 47;
    this.scrollLine = this.scrollOrigin-this.scrollRange;
    window.addEventListener("scroll", this._check_Position); //becuase we using "position: static", listener could not add on element directlly.
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this._check_Position);
  }

  render(){
    return(
      <div
        ref={this.boxTitle}
        className={classnames(styles.comMainTitle)}>
        <div
          style={this.style.withinCom_MainIndex_scroll_col_logo}>
          <SvgLogo/>
        </div>
        <div
          className={classnames('boxInlineRelative', styles.boxExplore, styles.fontExplore)}>
          <span style={{width: '73%', position: 'absolute', bottom: '7%', right: '8%', borderBottom: 'solid 0.75px #a8a8a8'}}></span>
          <Link
            to="/cosmic/explore"
            className={'plainLinkButton'}>
            {'explore'}
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    mainTitle: state.mainTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_title_topRatio: (int) => { dispatch(setCosmicTitle(int)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainTitle));
