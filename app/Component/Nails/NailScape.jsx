import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import DraftDisplay from '../DraftDisplay.jsx';

class NailScape extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._render_nails_marksBeans = this._render_nails_marksBeans.bind(this);
    this.style = {
      Com_Nails_Scape_: {
        display: 'inline-block',
        width: '46%',
        height: '40vh',
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '0.5vw',
        backgroundColor: '#FAFAFA',
        overflow: 'hidden'
      },
      Com_Nails_Scape_marks_: {
        width: '81%',
        height: '36%',
        position: 'absolute',
        bottom: '0',
        left: '0%',
        boxSizing: 'border-box',
        padding: '1% 3%',
        cursor: 'pointer'
      },
      Com_Nails_Scape_mark: {
        width: '100%',
        height: '30%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.3rem 0%',
        fontSize: '1.4rem',
        fontWeight: '300',
        letterSpacing: '0.12rem',
        textDecoration: 'none',
        color: 'black'
      },
      Com_Nails_Scape_banner_nouns_link: {
        display: 'inline-block',
        position: 'relative',
        margin: '0 5% 0 0'
      },
      Com_Nails_Scape_pic_: {
        width: '83%',
        height: '56%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      Com_Nails_Scape_pic_img_: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translate(-50%,0%)'
      },
      Com_Nails_Scape_banner_: {
        width: '80%',
        height: '8%',
        position: 'absolute',
        top:'56%',
        left: '0%',
        boxSizing: 'border-box',
        padding: '1% 0 0 3%'
      },
      Com_Nails_Scape_banner_nouns_: {
        display: 'inline-block',
        width: '50%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        fontSize: '1.4rem',
        fontWeight: '300',
        letterSpacing: '0.12rem',
        textAlign: 'right',
        textDecoration: 'none',
        color: 'black'
      },
      Com_Nails_Scape_banner_author: {
        display: 'inline-block',
        width: '40%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 0 0 0%'
      },
      Com_Nails_Scape_beans_: {
        width: '16%',
        height: '50%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        padding: '5%'
      }
    }
  }

  _render_nails_marksBeans(){

  }

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_Shared_nails_"+self.props.unitId+"_marks_"+i}
          style={self.style.Com_Nails_Scape_mark}>
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
          key={"key_Shared_nails_"+this.props.unitId+"_nouns_"+index}
          style={this.style.Com_Nails_Scape_banner_nouns_link}>
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
        style={Object.assign({margin: '0 2% 4vh 1%'}, this.style.Com_Nails_Scape_)}>
        <Link
          to={{
            pathname: "/units/"+this.props.unitId,
            state: {from: this.props.location}
          }}>
          <div
            unitname={this.props.unitId}
            style={this.style.Com_Nails_Scape_pic_}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={this.style.Com_Nails_Scape_pic_img_}/>
          </div>
          <div
            style={this.style.Com_Nails_Scape_beans_}>
            {this._render_nails_marksBeans()}
          </div>
          <div
            style={this.style.Com_Nails_Scape_banner_}>
            <div
              style={this.style.Com_Nails_Scape_banner_author}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </div>
            <div
              style={this.style.Com_Nails_Scape_banner_nouns_}>
              {this._render_nails_nouns()}
            </div>
          </div>
          <div
            style={this.style.Com_Nails_Scape_marks_}>
            {this._render_nails_Marks()}
          </div>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailScape));
