import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

export default class TitleInspired extends React.Component {
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
        className={classnames(styles.boxEmbed)}>
        <span
          className={classnames(styles.spanText, styles.fontTitle)}>
          {"Broaded"}</span>
      </div>
    )
  }
}
