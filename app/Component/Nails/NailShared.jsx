import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import DraftDisplay from '../DraftDisplay.jsx';

const commonStyle = {
  framePic: {
    width: '100%',
    height: '78%',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: 'black'
  },
  frameInfo: {
    width: '100%',
    height: '22%',
    position: 'relative',
    boxSizing: 'border-box'
  },
  maskPic: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: "linear-gradient(136deg, transparent, rgba(0, 0, 0, 0.03),rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))",
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
    cursor: 'pointer'
  },
  marksPicFrame: {
    width: '100%',
    maxHeight: '65%',
    position: 'absolute',
    bottom: '7%',
    right: '0%',
    cursor: 'pointer'
  },
  markPreview: {
    maxWidth: '86%',
    maxHeight: '64%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0% 4%',
    float: 'right',
    textAlign: 'left',
    fontSize: '1.28rem',
    fontWeight: '400',
    letterSpacing: '0.22rem',
    color: '#FAFAFA'
  },
  rowNouns: {
    width: '72%',
    position: 'absolute',
    top: '0',
    right: '0%',
    boxSizing: 'border-box',
    padding: '1.2vh 4%'
  },
  spanNoun: {
    display: 'inline-block',
    position: 'relative',
    float: 'right',
    marginLeft: '5%',
    fontSize: '1.28rem',
    fontWeight: '300',
    letterSpacing: '0.22rem',
    color: 'black'
  },
  rowBreach: {
    width: '64%',
    height: '64%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    boxSizing: 'border-box',
    padding: '0.2vh 3%'
  }
}

class NailShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style = {
      Com_Nails_Shared_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      Com_Nails_Shared_pic_img_: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '0%',
        left: '30%',
        transform: 'translate(-30%,0%)'
      },
      Com_Nails_Shared_breach_button_: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 2%',
        fontSize: '1.28rem',
        fontWeight: '300',
        letterSpacing: '0.22rem',
        color: 'grey',
        cursor: 'pointer'
      }
    }
  }

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let randomNr = Math.floor((Math.random())*10);
    let key = list[list.length > randomNr ? randomNr:0];

    return (
      <div
        style={commonStyle.markPreview}>
        <DraftDisplay
          editorState={this.props.marksBasic[key].editorContent}/>
      </div>
    );
  }

  _render_nails_nouns(){
    let list = this.props.unitBasic.nounsList;
    let nounsDOM = [];

    list.forEach((id, index)=>{
      nounsDOM.push(
        <span
          key={"key_Shared_nails_"+this.props.sharedId+"_nouns_"+index}
          style={commonStyle.spanNoun}>
          {id in this.props.nounsBasic ? (
            this.props.nounsBasic[id].name) : (
              null
            )}
        </span>
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
          }}
          className={"plainLinkButton"}>
          <div
            unitname={this.props.sharedId}
            style={commonStyle.framePic}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={this.style.Com_Nails_Shared_pic_img_}/>
            <div style={commonStyle.maskPic} />
            <div
              style={commonStyle.marksPicFrame}>
              {this._render_nails_Marks()}
            </div>
          </div>
        </Link>
        <div
          style={commonStyle.frameInfo}>
          <div
            style={commonStyle.rowNouns}>
            {this._render_nails_nouns()}
          </div>
          <div
            style={commonStyle.rowBreach}>
            <div
              style={this.style.Com_Nails_Shared_breach_button_}>
              <span>{"Res"}</span>
            </div>
            <Link
              to={this.props.match.url+"/"+this.props.sharedId+'/threads'}
              className={"plainLinkButton"}
              style={this.style.Com_Nails_Shared_breach_button_}>
              <span>{"Thr"}</span>
            </Link>
            <div style={this.style.Com_Nails_Shared_breach_button_}>{"N"}</div>
          </div>
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
