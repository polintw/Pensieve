import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import DraftDisplay from '../DraftDisplay.jsx';

class NailShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._handleClick_Nail_breachto_res = this._handleClick_Nail_breachto_res.bind(this);
    this.style = {
      Com_Nails_Shared_main_marks_: {
        width: '56%',
        height: '72%',
        position: 'absolute',
        top: '0',
        left: '2%',
        cursor: 'pointer'
      },
      Com_Nails_Shared_main_mark: {
        width: '100%',
        height: '30%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2% 1%'
      },
      Com_Nails_Shared_: {
        display: 'inline-block',
        width: '42%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0'
      },
      Com_Nails_Shared_nouns_: {
        width: '72%',
        height: '15%',
        position: 'absolute',
        bottom: '0',
        left: '2%',
        padding: '0 1%',
        fontSize: '1.4rem',
        fontWeight: '300',
        letterSpacing: '0.12rem',
        textDecoration: 'none',
        color: 'black'
      },
      Com_Nails_Shared_nouns_link: {
        display: 'inline-block',
        position: 'relative',
        margin: '0 5% 0 0'
      },
      Com_Nails_Shared_pic_: {
        width: '42%',
        height: '88%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      Com_Nails_Shared_pic_img_: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translate(-50%,0%)'
      },
      Com_Nails_Shared_breach_: {
        width: '25%',
        height: '15%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      Com_Nails_Shared_breach_button_: {
        display: 'inline-block',
        height: '48%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 2%',
        padding: '1%',
        verticalAlign: 'middle',
        fontSize: '1.1rem',
        letterSpacing: '0.14rem',
        textAlign: 'center',
        fontWeight: '400',
        color: '#000000',
        cursor: 'pointer',
        textDecoration: 'none'
      }
    }
  }

  _handleClick_Nail_breachto_res(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign("/cosmic/units/"+this.props.sharedId+"/related");
  }

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_Shared_nails_"+self.props.sharedId+"_marks_"+i}
          style={self.style.Com_Nails_Shared_main_mark}>
          <DraftDisplay
            editorState={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  _render_nails_nouns(){
    let list = this.props.unitBasic.nounsList;
    let nounsDOM = [];

    list.forEach((id, index)=>{
      nounsDOM.push(
        <div
          key={"key_Shared_nails_"+this.props.sharedId+"_nouns_"+index}
          style={this.style.Com_Nails_Shared_nouns_link}>
          {id in this.props.nounsBasic ? (
            this.props.nounsBasic[id].name) : (
              null
            )}
        </div>
      )
    })
    return nounsDOM;
  }

  render(){
    return(
      <div
        style={this.style.Com_Nails_Shared_}>
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.sharedId,
            state: {from: this.props.location}
          }}>
          <div
            style={this.style.Com_Nails_Shared_main_marks_}>
            {this._render_nails_Marks()}
          </div>
          <div
            unitname={this.props.sharedId}
            style={this.style.Com_Nails_Shared_pic_}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={this.style.Com_Nails_Shared_pic_img_}/>
          </div>
        </Link>
        <div
          style={this.style.Com_Nails_Shared_nouns_}>
          {this._render_nails_nouns()}
        </div>
        <div
          style={this.style.Com_Nails_Shared_breach_}>
          <div
            style={this.style.Com_Nails_Shared_breach_button_}
            onClick={this._handleClick_Nail_breachto_res}>
            <span>{"Res"}</span>
          </div>
          <Link
            to={this.props.match.url+"/"+this.props.sharedId+'/threads'}
            style={this.style.Com_Nails_Shared_breach_button_}>
            <span>{"Thr"}</span>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailShared));
