import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import styles from "./styleNavWalls.module.css";

const commonStyle = {
  align: {
    display: 'inline-block',
    width: '100%',
    height: '72%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(0, -50%)',
    boxSizing: 'border-box'
  },
  boxNavButton:{
    display: 'inline-block',
    width: '26%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginLeft: "6%",
  },
  spanButtonNavWalls: {
    top: '45%',
    fontSize: '1.36rem',
    fontWeight: '400',
    letterSpacing: '0.15rem',
  }
}

export default class NavWalls extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavWalls_: { //make a frame first, decoupling from parent
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavWalls_}>
        <div
          style={commonStyle.align}>
          <Link
            to={this.props.match.url+"/mutuals/dialogues"}
            className={'plainLinkButton'}
            style={commonStyle.boxNavButton}>
            <div
              className={styles.roundRecBox}
              style={{backgroundColor: this.props.location.pathname.includes("/mutuals/")? "#e6e6e6":'transparent'}}>
              <span
                className={'centerAlignChild'}
                style={Object.assign({}, commonStyle.spanButtonNavWalls, {color: this.props.location.pathname.includes("/mutuals/")? "black":'#757575'})}>
                {"mutual"}
              </span>
            </div>
          </Link>
          <Link
            to={this.props.match.url+"/embedded/inspireds"}
            className={'plainLinkButton'}
            style={commonStyle.boxNavButton}>
            <div
              className={styles.roundRecBox}
              style={{backgroundColor: this.props.location.pathname.includes("/embedded/") ? "#e6e6e6":'transparent'}}>
              <span
                className={'centerAlignChild'}
                style={Object.assign({}, commonStyle.spanButtonNavWalls, {color: this.props.location.pathname.includes("/embedded/")? "black":'#757575'})}>
                {"embed"}
              </span>
            </div>
          </Link>
          <Link
            to={this.props.match.url+"/actions/shareds"}
            className={'plainLinkButton'}
            style={commonStyle.boxNavButton}>
            <div
              className={styles.roundRecBox}
              style={{backgroundColor: this.props.location.pathname.includes("/actions/")? "#e6e6e6":'transparent'}}>
              <span
                className={'centerAlignChild'}
                style={Object.assign({}, commonStyle.spanButtonNavWalls, {color: this.props.location.pathname.includes("/actions/")? "black":'#757575'})}>
                {"actions"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
