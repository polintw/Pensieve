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
import LinkExplore from '../LinkExplore/LinkExplore.jsx';
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';
import DateConverter from '../../../Component/DateConverter.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
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
      withinCom_MainIndex_scroll_col_Create: {
        display: 'inline-block',
        width: '99px',
        height: '47%',
        position: 'relative',
        transform: "translate(0,-24%)",
        boxSizing: 'border-box',
        margin: '0 2%',
        float: 'right',
      },
      withinCom_MainIndex_scroll_col_logo: {
        display: 'inline-block',
        height: '31%',
        position: 'relative',
        top: '1%',
        boxSizing: 'border-box',
        margin: '0px 46% 5px 10%'
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
    let date = new Date();

    return(
      <div
        ref={this.boxTitle}
        className={'boxRelativeFull'}>
        <div
          style={this.style.withinCom_MainIndex_scroll_col_logo}>
          <SvgLogo/>
        </div>
        <div
          className={classnames('boxInlineRelative', styles.boxExplore, styles.fontExplore)}>
          <Link
            to="/explore/nouns"
            className={'plainLinkButton'}>
            {'explore'}
          </Link>
        </div>
        <div
          className={classnames(styles.boxDate, 'boxInlineRelative fontGillSN')}>
          <DateConverter
            place={'title'}
            datetime={date.getTime()}/>
        </div>
        <div
          style={this.style.withinCom_MainIndex_scroll_col_Create}>
          <SvgCreate
            place={false}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
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
