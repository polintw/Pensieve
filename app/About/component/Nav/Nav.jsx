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

const styleMiddle = {
  boxNav: {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '15vw',
    position: 'relative',
    boxSizing: 'border-box',
    textAlign: 'right'
  },
  fontNav: {
    fontSize: "1.36rem",
    letterSpacing: "0.08rem",
    whiteSpace: "nowrap",
    color: "#a8a8a8"
  },
  spanNav: {
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
}

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this.refScroll = React.createRef();
    this._handleEnter_Link = this._handleEnter_Link.bind(this);
    this._handleLeave_Link = this._handleLeave_Link.bind(this);
    this.style={

    }
  }

  _handleEnter_Link(e){
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_Link(e){
    this.setState({
      mouseOn: ''
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div
        style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
        <Link
          to="/terms"
          method="terms"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {
            (this.state.mouseOn=='terms') &&
            <span style={{
                width: '80%', position: 'absolute', bottom: '-11%', left: '10%',
                borderBottom: 'solid 1px rgb(64, 133, 160)'
              }}/>
            }
          <span>{"Terms"}</span>
        </Link>
        <Link
          to="/privacy"
          method="privacy"
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {
            (this.state.mouseOn=='privacy') &&
            <span style={{
                width: '80%', position: 'absolute', bottom: '-11%', left: '10%',
                borderBottom: 'solid 1px rgb(64, 133, 160)'
              }}/>
            }
          <span>{"Privacy"}</span>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    token: state.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav));
