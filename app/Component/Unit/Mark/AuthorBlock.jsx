import React from 'react';
import {connect} from "react-redux";
import AuthorInspired from './AuthorInspired.jsx';
import PanelJump from './PanelJump.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

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
  fontInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.18rem',
    lineHeight: '1.9rem',
    fontWeight: '300',
    color: '#f0f0f0',
  }
}

class AuthorBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.boxContent = React.createRef();
    this._set_stateDefault = ()=>{};
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};
    this.style = {
      Com_AuthorBlock_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '54%',
        height: '100%',
        position: 'absolute',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_AuthorBlock_content_: {
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
      Com_AuthorBlock_panel_: {
        display: 'inline-block',
        width: '100%',
        height: '24px',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%'
      },
    };
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
          this.style.Com_AuthorBlock_,
          {bottom: downToMdidline ? '44%':'', right: toCircleLeft? '0':'', left: toCircleLeft? '':'0'})}
        onClick={(e)=>{e.stopPropagation();}}>
        <div
          ref={this.boxContent}
          style={Object.assign({}, this.style.Com_AuthorBlock_content_)}>
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
            style={Object.assign({},this.style.Com_AuthorBlock_panel_)}>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, styleMiddle.fontInteractions, {float: 'left'})}>
              <AuthorInspired
                markKey={this.props.markKey}/>
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
