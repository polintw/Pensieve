import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import DraftDisplay from '../Draft/DraftDisplay.jsx';

const commonStyle = {
  maskPic: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.4))",
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
  },
  markPlate: {
    width: '100%',
    height: '76.5%',
    position: 'relative',
    boxSizing: 'border-box',
    border: '1.2px solid #9c9c9c',
    borderRadius: '1vh',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  },
  frameInfo: {
    width: '100%',
    height: '23.5%',
    position: 'relative',
    boxSizing: 'border-box'
  },
  markFrame: {
    width: '100%',
    maxHeight: '72%',
    position: 'absolute',
    bottom: '36%',
    right: '0%',
    transform: 'translate(0, 40%)',
    cursor: 'pointer'
  },
  markPreview: {
    maxWidth: '86%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0% 4%',
    float: 'right',
    textAlign: 'left',
    fontSize: '1.28rem',
    fontWeight: '400',
    letterSpacing: '0.22rem',
    color: 'black'
  },
  rowNouns: {
    width: '72%',
    position: 'absolute',
    top: '0',
    right: '0%',
    boxSizing: 'border-box',
    padding: '0.64vw 4%'
  },
  rowAuthor: {
    width: '64%',
    height: '64%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    boxSizing: 'border-box',
    padding: '0.6vw 3%'
  },
  spanNoun: {
    display: 'inline-block',
    position: 'relative',
    float: 'right',
    marginLeft: '5%',
    fontSize: '1.28rem',
    fontWeight: '300',
    letterSpacing: '0.28rem',
    color: '#dbdbdb'
  },
  spanAuthor: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 2%',
    fontSize: '1.36rem',
    fontWeight: '400',
    letterSpacing: '0.14rem',
    color: '#f2f2f2'
  }
}

class NailInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style = {
      Com_Nails_Inspired_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        overflow: 'hidden'
      },
      Com_Nails_Inspired_pic_img_: {
        width: '100%',
        height: 'auto',
        position: 'absolute',
        bottom: '0%',
        left: '0%',
      }
    }
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
        style={this.style.Com_Nails_Inspired_}>
        <img
          src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
          style={this.style.Com_Nails_Inspired_pic_img_}/>
        <div style={commonStyle.maskPic} />
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.unitId,
            search: "?mark="+this.props.markId,
            state: {from: this.props.location}
          }}
          className={"plainLinkButton"}>
          <div
            style={commonStyle.markPlate}>
            <div
              style={commonStyle.markFrame}>
              <div
                style={commonStyle.markPreview}>
                <DraftDisplay
                  editorState={this.props.markBasic.editorContent}/>
              </div>
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
            style={commonStyle.rowAuthor}>
            <span style={commonStyle.spanAuthor}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </span>
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
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailInspired));
