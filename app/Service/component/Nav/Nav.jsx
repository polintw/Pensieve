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
        className={classnames(styles.comAboutNav, styles.fontNav)}>
        <Link
          to="/terms"
          method="terms"
          className={classnames('plainLinkButton', styles.boxLink)}
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
          className={classnames('plainLinkButton', styles.boxLink)}
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
