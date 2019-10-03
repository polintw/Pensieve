import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import classnames from 'classnames';
import styles from "./styleNavWalls.module.css";

export default class NavWalls extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <div
        className={styles.comNavWalls}>
        <Link
          to={this.props.match.url+"/mutuals/dialogues"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}
          style={{backgroundColor: this.props.location.pathname.includes("/mutuals/")? "#e6e6e6":'transparent'}}>
          <span
            className={classnames(styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/mutuals/")? "#1a1a1a":'#757575'})}>
            {"mutual"}
          </span>
        </Link>
        <Link
          to={this.props.match.url+"/embedded/inspireds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}
          style={{backgroundColor: this.props.location.pathname.includes("/embedded/") ? "#e6e6e6":'transparent'}}>
          <span
            className={classnames(styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/embedded/")? "#1a1a1a":'#757575'})}>
            {"embed"}
          </span>
        </Link>
        <Link
          to={this.props.match.url+"/actions/shareds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}
          style={{backgroundColor: this.props.location.pathname.includes("/actions/")? "#e6e6e6":'transparent'}}>
          <span
            className={classnames(styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/actions/")? "#1a1a1a":'#757575'})}>
            {"actions"}
          </span>
        </Link>
      </div>
    )
  }
}
