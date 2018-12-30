import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Appearance from '../Component/Appearance.jsx';

class SelfCover extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      origin: '',
      scroll: false
    };
    this._handleMouse_selfCoverFrame = this._handleMouse_selfCoverFrame.bind(this);
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Self_pages_SelfCover_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        overflowY: 'scroll'
      },
      Self_pages_SelfCover_mainNav_: {
        width: '100%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_userName: {
        display: 'inline-block',
        width: '27%',
        position: 'absolute',
        top: '0%',
        right: '20%',
        fontSize: "4.2vh",
        letterSpacing: '0.49vh',
        fontWeight: '300',
        color: '#222222'
      },
      Self_pages_SelfCover_mainNav_options_: {
        display: 'inline-block',
        width: '50%',
        height: '56%',
        position: 'absolute',
        top: '0%',
        left: '24%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_options_expand: {
        display: 'inline-block',
        position: 'relative',
        top: '50%',
        left: '0%',
        boxSizing: 'border-box',
        transform: 'translate(0, -50%)',
        fontSize: "3.6vh",
        letterSpacing: '0.4vh',
        color: '#222222',
        cursor: 'pointer'
      },
      Self_pages_SelfCover_mainNav_options_expand_inform_: {
        display: 'inline-block',
        width: '24%',
        height: '40%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_options_expand_inform_svg: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_options_recent: {
        display: 'inline-block',
        width: '40%',
        height: '40%',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        color: '#222222',
        cursor: 'pointer'
      },
      Self_pages_SelfCover_hidden_appearance: {
        width: '60%',
        minHeight: '64%',
        position: 'absolute',
        top: '64%',
        left: '20%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_close_: {
        width: '5%',
        height: '18%',
        position: 'absolute',
        bottom: '5%',
        left: '28%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_close_svg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_Logo: {
        position: 'absolute',
        bottom:'7%',
        right: '10%',
        boxSizing: 'border-box',
        fontSize: '1.6vh',
        letterSpacing: '0.2vh',
        color: '#222222'
      }
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/embedded/inspireds');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleMouse_selfCoverFrame(event){
    if(this.selfCover_.scrollTop==0){
      if(!this.state.scroll && event.deltaY > 0){
        this.setState((prevState, props)=>{
          return {scroll: true}
        }, ()=>{
          if(this.state.scroll) this.selfCover_.scrollTo({top: 1, behavior: "smooth"});
        });
      }else if(this.state.scroll && event.deltaY < 0){
        this.setState((prevState, props)=>{
          return {scroll: false}
        });
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/overview');
        }else{
          window.location.assign('/cosmic/people/'+identifier);
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nouns/'+identifier);
        break;
      default:
        return
    }
  }

  componentDidMount() {
    this.setState({origin: this.selfCover_pagenav.getBoundingClientRect().top});
  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      <div
        ref={(element)=>{this.selfCover_=element;}}
        style={this.style.Self_pages_SelfCover_}
        onWheel={this._handleMouse_selfCoverFrame}>
        <div style={{width: '100%', height: '81%', position: 'fixed', backgroundColor: 'rgba(181, 181, 181, 0.8)'}}></div>
        <div
          ref={(element)=>{this.selfCover_pagenav=element;}}
          style={Object.assign({height: this.state.scroll? '20vh': '45vh'}, this.style.Self_pages_SelfCover_mainNav_)}>
          <div
            style={this.style.Self_pages_SelfCover_mainNav_options_}>
            <div
              style={this.style.Self_pages_SelfCover_mainNav_options_expand}
              onClick={this._handleClick_nav_expand}>
              {'Expand'}
              <div
                style={this.style.Self_pages_SelfCover_mainNav_options_expand_inform_}>
                <svg
                  style={this.style.Self_pages_SelfCover_mainNav_options_expand_inform_svg}>
                  <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" switch "}</text>
                  <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
                </svg>
              </div>
              <div
                style={this.style.Self_pages_SelfCover_mainNav_options_expand_inform_}>
                <svg
                  style={this.style.Self_pages_SelfCover_mainNav_options_expand_inform_svg}>
                  <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" Growth "}</text>
                  <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
                </svg>
              </div>
            </div>
          </div>
          <div style={this.style.Self_pages_SelfCover_mainNav_userName}>
            {this.state.userInfo.account}
          </div>
          <div style={this.style.Self_pages_SelfCover_Logo}>
            {'CORNER'}
          </div>
          <div
            style={this.style.Self_pages_SelfCover_close_}>
            <svg
              style={this.style.Self_pages_Front_Scape_circle}>
              <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
              <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
            </svg>
          </div>
        </div>
        {
          this.state.scroll &&
          <Router
            basename={"/self"}>
            <div
              style={this.style.Self_pages_SelfCover_hidden_appearance}>
              <Route path="/" render={(props)=> <Appearance {...props} urlParam={"/router/user/cover"} urlQuery={"?id="+this.state.userInfo.id} _refer_von_unit={this._refer_leaveSelf}/>}/>
            </div>
          </Router>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(SelfCover);
