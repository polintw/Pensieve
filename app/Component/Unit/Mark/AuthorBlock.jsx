import React from 'react';
import {connect} from "react-redux";
import MarkDialogue from './MarkDialogue.jsx';
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import SvgPropic from '../../Svg/SvgPropic.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

const styleMiddle = {
  boxInteraction: {
    display: 'inline-block',
    width: '100%',
    position: 'absolute',
    top: '100%',
    right: '0',
    boxSizing: 'border-box',
  },
  boxPanelInteraction: {
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  svgBulbPlain: {
    strokeWidth:'10px',
    stroke: '#f7f4bc',
    fill: 'transparent'
  },
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
      dialogue: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_AuthorBlock_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '54%',
        minHeight: '54%',
        maxHeight: '154%',//the target MaxHeight is 64% to the entire img
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_AuthorBlock_content_: {
        display: 'inline-block',
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
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%'
      },
      Com_AuthorBlock_credits_: {
        display: 'inline-block',
        width: '100%',
        height: '2.6rem',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%',
      },
      Com_AuthorBlock_fold_:{
        display: 'none'
      },
      Com_AuthorBlock_fold_dialogue: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
      Com_AuthorBlock_panel_interaction_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      },
      Com_AuthorBlock_panel_interaction_bulb:{
        display: 'inline-block',
        width: '17px',
        position: 'relative',
        margin: '0 4%',
      }
    };
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return this.state.dialogue?{dialogue: false}: {dialogue: true}})
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
    const toCircleLeft = this.props.toCircleLeft;// both props come from OpenedMark
    //we use these two cosnt to tune the position of whole <div> for not protruding out the view
    return(
      <div
        style={Object.assign({},
          this.style.Com_AuthorBlock_,
          {bottom: downToMdidline ? '38%':'', float: toCircleLeft? 'right':'left'})}>
        <div
          style={Object.assign({}, this.style.Com_AuthorBlock_content_)}>
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
          style={styleMiddle.boxInteraction}>
          <div
            style={Object.assign({},this.style.Com_AuthorBlock_panel_)}>
            <div
              style={Object.assign({},
                styleMiddle.boxPanelInteraction, {float: 'right'})}>
              <span
                style={Object.assign({}, styleMiddle.spanInteractions)}>
                {this.props.unitCurrent.marksInteraction[this.props.markKey].inspired+"/"}</span>
            </div>
            <div
              style={Object.assign({},
                this.style.Com_AuthorBlock_panel_interaction_bulb,
                styleMiddle.svgBulbPlain,
                styleMiddle.boxPanelInteraction, {float: 'right'})}>
              <SvgBulbPlainHalf/>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {float: 'right'})}>
              <span
                style={styleMiddle.spanInteractions}
                onClick={this._handleClick_openDialogue}>
                {'raise'}
              </span>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {margin: '0 3%', float: 'left'})}>
              <span style={styleMiddle.spanInteractions}>{' < '}</span>
              <span style={styleMiddle.spanInteractions}>{'next'}</span>
            </div>
          </div>
          <div
            style={Object.assign({}, this.style.Com_AuthorBlock_credits_)}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div
            style={{display: 'inline-block', position: 'relative'}}>
            {"(多行參考資料連結)"}
          </div>
        </div>
        <div
          style={this.style.Com_AuthorBlock_fold_}>
          {
            this.state.dialogue &&
            <div
              style={this.style.Com_AuthorBlock_fold_dialogue}>
              <MarkDialogue
                markKey={this.props.markKey}/>
            </div>
          }
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
