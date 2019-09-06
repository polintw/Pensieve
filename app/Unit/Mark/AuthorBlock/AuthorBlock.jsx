import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import PanelJump from '../PanelJump.jsx';
import AuthorInspired from '../AuthorInspired.jsx';
import DraftDisplay from '../../../Component/Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

const styleMiddle = {
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
  }
}

class AuthorBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.boxContent = React.createRef();
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};
    this.style = {
      Com_AuthorBlock_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      },
      Com_AuthorBlock_content_: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom:'27px'
      },
      Com_AuthorBlock_panel_: {
        width: '100%',
        height: '2.1rem',
        boxSizing: 'border-box',
        margin: '1.2rem 0px 1.8rem',
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

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
        style={this.style.Com_AuthorBlock_}>
        <div
          ref={this.boxContent}
          style={Object.assign({}, this.style.Com_AuthorBlock_content_)}>
          <div
            style={{
              width: '100%',
              height: this.props.downToMdidline? (100 -this.props.inBlockHeight) +'vh': (this.props.inBlockHeight-69+4)+'vh'
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
              height: this.props.downToMdidline? (this.props.inBlockHeight- 57)+'vh': (100 -this.props.inBlockHeight+14-4)+'vh'
            }
          )}>
          <div
            style={Object.assign({},this.style.Com_AuthorBlock_panel_)}>
            <div
              style={Object.assign(
                {},
                styleMiddle.boxPanelInteraction,
                styleMiddle.fontInteractions,
                {marginLeft: '58%',float: 'left'}
              )}>
              <AuthorInspired
                markKey={this.props.markKey}/>
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
