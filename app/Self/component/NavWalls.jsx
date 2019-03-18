import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';

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
  buttonRound: {
    display: 'inline-block',
    width: '26%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginLeft: "6%",
    borderRadius: '1.6vh',
    backgroundColor: '#e6e6e6',
    color: 'black'
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
      },
      selfCom_NavWalls_spanButton: {
        fontSize: '1.4rem',
        fontWeight: '400',
        letterSpacing: '0.12rem',
        lineHeight: '1rem',
        cursor: 'pointer'
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
          <div
            style={commonStyle.buttonRound}>
            <Link
              to={this.props.match.url+"/actions/shareds"}
              className={'selfLinkButton centerAlignChild'}>
              <span
                style={this.style.selfCom_NavWalls_spanButton}>
                {"actions"}
              </span>
            </Link>
          </div>
          <div
            style={commonStyle.buttonRound}>
            <Link
              to={this.props.match.url+"/embedded/inspireds"}
              className={'selfLinkButton centerAlignChild'}>
              <span
                style={this.style.selfCom_NavWalls_spanButton}>
                {"embed"}
              </span>
            </Link>
          </div>
          <div
            style={commonStyle.buttonRound}>
            <Link
              to={this.props.match.url+"/mutuals/dialogues"}
              className={'selfLinkButton centerAlignChild'}>
              <span
                style={this.style.selfCom_NavWalls_spanButton}>
                {"mutual"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
