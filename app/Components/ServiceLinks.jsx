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
        <div className={classnames('tagServiceLink')}>
            <a
              href="/a/about"
              method="about"
              className={classnames(
                'plainLinkButton',
                'fontServiceLink',
                'colorGrey'
              )}
              style={{borderBottom: this.state.mouseOn=='about' ? "solid 0.75px #ababab" : "solid 0.75px transparent"}}
              onMouseEnter={this._handleEnter_Link}
              onMouseLeave={this._handleLeave_Link}>
              {"About"}</a>
        </div>
        <div className={classnames('tagServiceLink')}>
            <a
              href="/a/privacy"
              method="privacy"
              className={classnames(
                'plainLinkButton',
                'fontServiceLink',
                'colorGrey'
              )}
              style={{borderBottom: this.state.mouseOn=='privacy' ? "solid 0.75px #ababab" : "solid 0.75px transparent"}}
              onMouseEnter={this._handleEnter_Link}
              onMouseLeave={this._handleLeave_Link}>
              {"Privacy"}</a>
        </div>
        <div className={classnames('tagServiceLink')}>
            <a
              href="/a/terms"
              method="terms"
              className={classnames(
                'plainLinkButton',
                'fontServiceLink',
                'colorGrey'
              )}
              style={{borderBottom: this.state.mouseOn=='terms' ? "solid 0.75px #ababab" : "solid 0.75px transparent"}}
              onMouseEnter={this._handleEnter_Link}
              onMouseLeave={this._handleLeave_Link}>
              {"Terms"}</a>
        </div>
        <div className={classnames('tagServiceLink')}>
          <a
            href="/a/contact"
            method="contact"
            className={classnames(
              'plainLinkButton',
              'fontServiceLink',
              'colorGrey'
            )}
            style={{borderBottom: this.state.mouseOn=='contact' ? "solid 0.75px #ababab" : "solid 0.75px transparent"}}
            onMouseEnter={this._handleEnter_Link}
            onMouseLeave={this._handleLeave_Link}>
            {"Contact"}</a>
        </div>
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
