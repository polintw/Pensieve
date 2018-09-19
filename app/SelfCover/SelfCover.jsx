import React from 'react';
import cxBind from 'classnames/bind';
import Appearance from './component/Appearance.jsx';
import CreateShare from '../Component/CreateShare.jsx';

export default class SelfCover extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic,
      origin: '',
      scroll: false
    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleMouse_selfCoverFrame = this._handleMouse_selfCoverFrame.bind(this);
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
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
        left: '20%',
        fontSize: "5.6vh",
        letterSpacing: '0.6vh',
        fontWeight: '300',
        color: '#222222'
      },
      Self_pages_SelfCover_mainNav_options_: {
        display: 'inline-block',
        width: '27%',
        height: '20vh',
        position: 'absolute',
        bottom: '0%',
        right: '20%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_options_expand: {
        display: 'inline-block',
        width: '100%',
        height: '40%',
        position: 'relative',
        top: '0%',
        left: '0%',
        fontSize: "3.6vh",
        letterSpacing: '0.4vh',
        color: '#222222',
        cursor: 'pointer'
      },
      Self_pages_SelfCover_mainNav_options_create: {
        display: 'inline-block',
        width: '55%',
        height: '40%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2% 0'
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
        width: '6%',
        height: '8%',
        position: 'fixed',
        top: '64%',
        right: '2%',
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
        width: '16%',
        height: '10%',
        position: 'fixed',
        bottom:'0%',
        left: '6%',
        boxSizing: 'border-box',
        fontSize: '3.2vh',
        letterSpacing: '0.4vh',
        color: '#222222'
      }
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/self/front');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleMouse_selfCoverFrame(event){
    if(this.selfCover_.scrollTop==0){
      if(!this.state.scroll && event.deltaY>0){
        this.setState((prevState, props)=>{
          return {scroll: true}
        }, ()=>{
          if(this.state.scroll) this.selfCover_.scrollTo({top: 1, behavior: "smooth"});
        });
      }else if(this.state.scroll && event.deltaY<0){
        this.setState((prevState, props)=>{
          return {scroll: false}
        });
      }
    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/self/front');
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
        <div style={this.style.Self_pages_SelfCover_Logo}>{'CORNER'}</div>
        <div
          ref={(element)=>{this.selfCover_pagenav=element;}}
          style={Object.assign({height: this.state.scroll? '20vh': '45vh'}, this.style.Self_pages_SelfCover_mainNav_)}>
          <div style={this.style.Self_pages_SelfCover_mainNav_userName}>{this.state.userBasic.account}</div>
          <div
            style={this.style.Self_pages_SelfCover_mainNav_options_}>
            <div
              style={this.style.Self_pages_SelfCover_mainNav_options_expand}
              onClick={this._handleClick_nav_expand}>
              {'Expand'}
            </div>
            <div
              style={this.style.Self_pages_SelfCover_mainNav_options_create}>
              <img src="/images/vacancy.png" style={{width: '100%', maxHeight: '100%'}}/>
              <CreateShare
                _submit_Share_New={this._submit_Share_New}/>
            </div>
            <div
              style={this.style.Self_pages_SelfCover_mainNav_options_recent}>
              {"recent"}
            </div>
          </div>
        </div>
        {
          this.state.scroll &&
          <div
            style={this.style.Self_pages_SelfCover_hidden_appearance}>
            <Appearance/>
          </div>
        }
        <div
          style={this.style.Self_pages_SelfCover_close_}>
          <svg
            style={this.style.Self_pages_SelfCover_close_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'
              style={{cursor: 'pointer'}}
              onClick={this._handleClick_selfClose}>
              {" x "}
            </text>
          </svg>
        </div>
      </div>
    )
  }
}
