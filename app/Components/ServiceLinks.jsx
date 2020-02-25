import React from 'react';
import {
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

class ServiceLinks extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
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
        className={classnames('boxServiceLink')}>
        <a
          href="https://www.facebook.com/cornerth.center/"
          target="_blank"
          method="about"
          className={classnames(
            'plainLinkButton',
            'tagServiceLink',
            'fontServiceLink',
            {['tagServiceLinkMouse']: this.state.mouseOn=='about'}
          )}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {"About"}</a>
        <span className={classnames('tagServiceLink', 'fontServiceLink')}>{"．"}</span>
        <a
          href="/a/privacy"
          method="privacy"
          className={classnames(
            'plainLinkButton',
            'tagServiceLink',
            'fontServiceLink',
            {['tagServiceLinkMouse']: this.state.mouseOn=='privacy'}
          )}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {"Privacy"}</a>
        <span className={classnames('tagServiceLink', 'fontServiceLink')}>{"．"}</span>
        <a
          href="/a/terms"
          method="terms"
          className={classnames(
            'plainLinkButton',
            'tagServiceLink',
            'fontServiceLink',
            {['tagServiceLinkMouse']: this.state.mouseOn=='terms'}
          )}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {"Terms"}</a>
        <span className={classnames('tagServiceLink', 'fontServiceLink')}>{"．"}</span>
        <a
          href="https://www.facebook.com/cornerth.center/"
          target="_blank"
          method="contact"
          className={classnames(
            'plainLinkButton',
            'tagServiceLink',
            'fontServiceLink',
            {['tagServiceLinkMouse']: this.state.mouseOn=='contact'}
          )}
          onMouseEnter={this._handleEnter_Link}
          onMouseLeave={this._handleLeave_Link}>
          {"Contact"}</a>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceLinks));
