import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import PanelJump from '../PanelJump.jsx';
import ViewerBulb from '../ViewerBulb.jsx';
import MarkDialogue from '../MarkDialogue.jsx';
import SvgPropic from '../../../Component/Svg/SvgPropic.jsx';
import DraftDisplay from '../../../Component/Draft/DraftDisplay.jsx';

const styleMiddle = {
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
    fontWeight: '400',
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
    this.comViewerBlock = React.createRef();
    this._set_stateDefault = ()=>{this.setState({dialogue: false, message: false})};
    this._set_BlockMessage = this._set_BlockMessage.bind(this);
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_ViewerBlock_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      },
      Com_ViewerBlock_content_: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom:'32px'
      },
      Com_ViewerBlock_panel_: {
        width: '100%',
        height: '2.1rem',
        boxSizing: 'border-box',
        margin: '2.2rem 0px 1.8rem',
      },
      Com_ViewerBlock_credits_: {
        width: '100%',
        height: '2.6rem',
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

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.markKey !== this.props.markKey){ //we use the same component rendering mark repeatly
      //so we have to reset the state & scroll top each time jumpinig to a new mark
      this._set_stateDefault();
      this.comViewerBlock.current.scrollTop = 0; //back to top
    }
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
        ref={this.comViewerBlock}
        style={this.style.Com_ViewerBlock_}>
        <div
          ref={this.boxContent}
          style={Object.assign({}, this.style.Com_ViewerBlock_content_)}>
          <div
            style={{
              width: '100%',
              height: this.props.inBlockHeight+'vh'
            }}></div>
          <div
            className={classnames(styles.boxContentDraft, styles.fontContentDraft)}>
            <DraftDisplay
              editorState={this.props.markData.editorContent}/>
          </div>
          <div
            className={classnames(styles.boxPanelJump, styles.fontPanelJump)}>
            <PanelJump
              marksLength={this.props.marksLength}
              currentSerial={this.props.currentSerial}
              _set_markJump={this.props._set_markJump}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxInteraction)}
          style={Object.assign(
            {},
            {
              height: (100-52-this.props.inBlockHeight)+'vh'
            }
          )}>
          <div
            style={Object.assign({},this.style.Com_ViewerBlock_panel_)}>
            <div
              style={Object.assign(
                {},
                styleMiddle.boxPanelInteraction,
                {marginRight: '8%',float: 'right'}
              )}>
              <span
                style={styleMiddle.spanInteractions}
                onClick={this._handleClick_openDialogue}>
                {'raise'}
              </span>
            </div>
            <div
              style={Object.assign(
                {},
                styleMiddle.boxPanelInteraction,
                {marginLeft: '69%',float: 'left'}
              )}>
              <ViewerBulb
                markKey={this.props.markKey}
                _set_BlockMessage={this._set_BlockMessage}/>
            </div>
          </div>
          {
            this.state.message &&
            <div
              style={styleMiddle.boxMessage}>
              <span style={styleMiddle.textMessage}>{this.state.message}</span>
            </div>
          }
          <div
            style={Object.assign({}, this.style.Com_ViewerBlock_credits_)}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div>
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
