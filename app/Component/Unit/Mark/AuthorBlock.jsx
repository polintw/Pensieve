import React from 'react';
import {connect} from "react-redux";
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

const styleMiddle = {
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.12rem',
    lineHeight: '1.9rem',
    fontWeight: '400',
    color: '#f7f4bc'
  }
}

class AuthorBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this.style = {
      Com_AuthorBlock_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_AuthorBlock_content_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '49%',
        minHeight: '54%',
        maxHeight: '154%', //the target MaxHeight is 64%, limit by parent
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        paddingBottom: '7%',
        paddingLeft: '6%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflowY: 'auto'
      },
      Com_AuthorBlock_panel_: {
        width: '100%',
        height: '14%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%',
        float: 'right'
      },
      Com_AuthorBlock_panel_interaction_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      },
      Com_AuthorBlock_panel_interaction_inspired_:{
        display: 'inline-block',
        minWidth: '70px',
        height: '100%',
        position: 'absolute',
      },
      Com_AuthorBlock_panel_interaction_bulb:{
        width: '36%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box',
        marginRight: '16%',
        strokeWidth:'10px'
      },
      Com_AuthorBlock_panel_interaction_count: {
        position: 'absolute',
        top:"50%",
        left:'50%',
        transform: 'translate(0,-50%)'
      }
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;
    let styleByMidline = {
      editor: downToMdidline ? {bottom: '38%', position: 'absolute', right:toCircleLeft?'0':'',left:toCircleLeft?'':'0' }:{},
      panel: downToMdidline ? {bottom: '18%', position: 'absolute'}:{},
      credits: downToMdidline ? {bottom: '0', position: 'absolute'}:{},
    },
    styleByCircle = {
      inspired: toCircleLeft?{right: '12%'}:{left: '6%'}
    }
    return(
      <div
        style={this.style.Com_AuthorBlock_}>
        <div
          style={
            Object.assign({},
              this.style.Com_AuthorBlock_content_,
              {float: toCircleLeft? 'right':'left'},
              styleByMidline.editor
            )}>
          <div
            style={{
              width: '48%',
              height: ' 42%',
              position:'absolute',
              left: '0',
              bottom:'0%',
              borderLeft: 'solid 1px #ababab',
              borderBottom: 'solid 1px #ababab'}}></div>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={Object.assign({},this.style.Com_AuthorBlock_panel_, styleByMidline.panel)}>
          <div
            style={this.style.Com_AuthorBlock_panel_interaction_}>
            <div
              style={Object.assign({}, this.style.Com_AuthorBlock_panel_interaction_inspired_, styleByCircle.inspired)}>
              <div
                style={Object.assign({}, this.style.Com_AuthorBlock_panel_interaction_bulb, {stroke: '#f7f4bc', fill: 'transparent'})}>
                <SvgBulbPlainHalf/>
              </div>
              <span
                style={Object.assign({}, styleMiddle.spanInteractions, this.style.Com_AuthorBlock_panel_interaction_count)}>
                {this.props.unitCurrent.marksInteraction[this.props.markKey].inspired+"/"}</span>
            </div>
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
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorBlock);
