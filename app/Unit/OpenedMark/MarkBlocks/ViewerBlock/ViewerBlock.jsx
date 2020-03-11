import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import DraftDisplay from '../../../../Components/Draft/DraftDisplay.jsx';

const styleMiddle = {
  boxMessage: {
    boxSizing: 'border-box',
    padding: '1rem 0.7rem 0'
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
      message: false
    };
    this.boxContent = React.createRef();
    this.comViewerBlock = React.createRef();
    this._set_stateDefault = ()=>{this.setState({message: false})};
    this._set_BlockMessage = this._set_BlockMessage.bind(this);
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};

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
        marginBottom:'54px'
      },
    };
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
              height: '13vh'
            }}></div>
          <div
            className={classnames(styles.boxContentDraft, styles.fontContentDraft)}>
            <DraftDisplay
              editorState={this.props.markData.editorContent}/>
          </div>

        </div>
        <div
          className={classnames(styles.boxInteraction)}
          style={Object.assign(
            {},
            {
              height: '18vh'
            }
          )}>
          <div className={styles.boxInteractBack}>
            <div className={styles.boxInteractBackGradiant}/>
            <div className={styles.boxInteractBackSolid}/>
          </div>

          {
            this.state.message &&
            <div
              style={styleMiddle.boxMessage}>
              <span style={styleMiddle.textMessage}>{this.state.message}</span>
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
