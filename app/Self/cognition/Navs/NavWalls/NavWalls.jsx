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
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <span
            className={classnames(styles.spanButton, styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/mutuals/")? "#1a1a1a":'#a8a8a8'})}>
            {"mutual"}
          </span>
        </Link>
        <Link
          to={this.props.match.url+"/embedded/inspireds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <span
            className={classnames(styles.spanButton, styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/embedded/")? "#1a1a1a":'#a8a8a8'})}>
            {"embed"}
          </span>
        </Link>
        <Link
          to={this.props.match.url+"/actions/shareds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <span
            className={classnames(styles.spanButton, styles.fontButton)}
            style={Object.assign({}, {color: this.props.location.pathname.includes("/actions/")? "#1a1a1a":'#a8a8a8'})}>
            {"actions"}
          </span>
        </Link>
      </div>
    )
  }
}
