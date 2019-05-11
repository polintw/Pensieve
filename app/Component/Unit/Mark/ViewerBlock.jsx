import React from 'react';
import {connect} from "react-redux";
import PanelJump from './PanelJump.jsx';
import ViewerBulb from './ViewerBulb.jsx';
import MarkDialogue from './MarkDialogue.jsx';
import SvgPropic from '../../Svg/SvgPropic.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';

const styleMiddle = {
  boxInteraction: {
    display: 'inline-block',
    width: '100%',
    position: 'static',
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
  boxMessage: {
    boxSizing: 'border-box',
    padding: '1rem 0.7rem 0'
  },
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.18rem',
    lineHeight: '1.9rem',
    fontWeight: '300',
    color: '#f0f0f0',
    cursor: 'pointer'
  },
  textMessage: {
    fontSize: '1.2rem',
    letterSpacing: '0.1rem',
    fontStyle: 'italic',
    color: '#adadad',
    cursor: 'default'
  }
}

class ViewerBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dialogue: false,
      message: false
    };
    this.boxContent = React.createRef();
    this._set_stateDefault = ()=>{this.setState({dialogue: false, message: false})};
    this._set_BlockMessage = this._set_BlockMessage.bind(this);
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_ViewerBlock_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '56%',
        height: '100%',
        position: 'absolute',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_ViewerBlock_content_: {
        display: 'inline-block',
        minHeight: '49%',
        maxHeight: '147%',//the target MaxHeight is 64% to the entire img
        position: 'relative',
        boxSizing: 'border-box',
        paddingLeft: '6%',
        marginBottom: '7%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflowY: 'auto'
      },
      Com_ViewerBlock_panel_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%'
      },
      Com_ViewerBlock_credits_: {
        display: 'inline-block',
        width: '100%',
        height: '2.6rem',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%',
      },
      Com_ViewerBlock_fold_:{
        display: 'none'
      },
      Com_ViewerBlock_fold_dialogue: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
    };
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return this.state.dialogue?{dialogue: false}: {dialogue: true}})
  }

  _set_BlockMessage(message){
    this.setState({message: message});
  }

  componentDidMount(){
    this.boxContent.current.addEventListener('wheel', this._handleWheel_boxContent, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //so we could only add listener like this way to set the 'passive' manually.
    //and becuase we preventDefault in LayerScroll, the scroll will totally be ignore
    //so we need to stopPropagation if there is a scroll box in any child of LayerScroll
  }

  componentWillUnmount(){
    this.boxContent.current.removeEventListener('wheel',this._handleWheel_boxContent);
  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;// both props come from OpenedMark
    //we use these two cosnt to tune the position of whole <div> for not protruding out the view

    return(
      <div
        style={Object.assign({},
          this.style.Com_ViewerBlock_,
          {bottom: downToMdidline ? '44%':'', right: toCircleLeft? '0':'', left: toCircleLeft? '':'0'})}
        onClick={(e)=>{e.stopPropagation();}}>
        <div
          ref={this.boxContent}
          style={Object.assign({}, this.style.Com_ViewerBlock_content_)}>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={{position: 'relative'}}>
          <div
            style={{
              width: '48%',
              borderBottom: 'solid 1px #ababab'}}></div>
        </div>
        <div
          style={styleMiddle.boxInteraction}>
          <div
            style={Object.assign({},this.style.Com_ViewerBlock_panel_)}>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {float: 'left'})}>
              <span
                style={styleMiddle.spanInteractions}
                onClick={this._handleClick_openDialogue}>
                {'raise'}
              </span>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {float: 'left'})}>
              <ViewerBulb
                markKey={this.props.markKey}
                _set_BlockMessage={this._set_BlockMessage}/>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {margin: '0 3%', float: 'right'})}>
              <PanelJump
                marksLength={this.props.marksLength}
                currentSerial={this.props.currentSerial}
                _set_markJump={this.props._set_markJump}
                _set_stateDefault={this._set_stateDefault}/>
            </div>
          </div>
          <div
            style={styleMiddle.boxMessage}>
            {
              this.state.message &&
              <span style={styleMiddle.textMessage}>{this.state.message}</span>
            }
          </div>
          <div
            style={Object.assign({}, this.style.Com_ViewerBlock_credits_)}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div
            style={{display: 'inline-block', position: 'relative'}}>
            {"(多行參考資料連結)"}
          </div>
        </div>
        <div
          style={this.style.Com_ViewerBlock_fold_}>
          {
            this.state.dialogue &&
            <div
              style={this.style.Com_ViewerBlock_fold_dialogue}>
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
)(ViewerBlock);
