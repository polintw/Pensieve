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
      mouseOn: ''
    };
    this._handleEnter_Option = this._handleEnter_Option.bind(this);
    this._handleLeave_Option = this._handleLeave_Option.bind(this);
    this.style={

    }
  }

  _handleEnter_Option(e){
    this.setState({
      mouseOn: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_Option(e){
    this.setState({
      mouseOn: ''
    })
  }

  render(){
    return(
      <div
        className={styles.comNavWalls}>
        <Link
          to={this.props.match.url+"/mutuals/dialogues"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <div
            value={'mutuals'}
            style={{position: 'relative'}}
            onMouseEnter={this._handleEnter_Option}
            onMouseLeave={this._handleLeave_Option}>
            {
              (this.state.mouseOn=='mutuals' || this.props.location.pathname.includes("/mutuals/")) &&
              <span style={{
                  width: '95%', position: 'absolute', top: '-10%', right: '0%',
                  borderBottom: 'solid 0.75px #ff7a5f'
                }}/>
              }
              <span
                className={classnames(styles.spanButton, styles.fontButton)}
                style={
                  Object.assign({}, {
                    color: (this.state.mouseOn=='mutuals' || this.props.location.pathname.includes("/mutuals/"))? "#1a1a1a":'#a8a8a8'}
                  )}>
                {"mutual"}
              </span>
          </div>
        </Link>
        <Link
          to={this.props.match.url+"/embedded/inspireds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <div
            value={'embedded'}
            style={{position: 'relative'}}
            onMouseEnter={this._handleEnter_Option}
            onMouseLeave={this._handleLeave_Option}>
            {
              (this.state.mouseOn=='embedded' || this.props.location.pathname.includes("/embedded/")) &&
              <span style={{
                  width: '95%', position: 'absolute', top: '-10%', right: '0%',
                  borderBottom: 'solid 0.75px #ff7a5f'
                }}/>
              }
              <span
                className={classnames(styles.spanButton, styles.fontButton)}
                style={
                  Object.assign({}, {
                    color: (this.state.mouseOn=='embedded' || this.props.location.pathname.includes("/embedded/"))? "#1a1a1a":'#a8a8a8'}
                  )}>
                {"embed"}
              </span>
          </div>
        </Link>
        <Link
          to={this.props.match.url+"/actions/shareds"}
          className={classnames('plainLinkButton', styles.roundRecBox, styles.boxButton)}>
          <div
            value={'actions'}
            style={{position: 'relative'}}
            onMouseEnter={this._handleEnter_Option}
            onMouseLeave={this._handleLeave_Option}>
            {
              (this.state.mouseOn=='actions' || this.props.location.pathname.includes("/actions/")) &&
              <span style={{
                  width: '95%', position: 'absolute', top: '-10%', right: '0%',
                  borderBottom: 'solid 0.75px #ff7a5f'
                }}/>
              }
              <span
                className={classnames(styles.spanButton, styles.fontButton)}
                style={
                  Object.assign({}, {
                    color: (this.state.mouseOn=='actions' || this.props.location.pathname.includes("/actions/"))? "#1a1a1a":'#a8a8a8'}
                  )}>
                {"actions"}
              </span>
          </div>
        </Link>
      </div>
    )
  }
}
