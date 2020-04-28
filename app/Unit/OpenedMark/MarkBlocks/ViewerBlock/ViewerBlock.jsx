import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../../stylesFont.module.css';
import DraftDisplay from '../../../../Components/Draft/DraftDisplay.jsx';

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
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
    return(
      <div
        ref={this.comViewerBlock}
        style={this.style.Com_ViewerBlock_}>
        <div
          ref={this.boxContent}
          className={classnames(styles.boxBlockDraft)}>
          <div
            className={classnames(styles.boxDraftDisplay, stylesFont.fontContent, stylesFont.colorEditBlack)}>
            <DraftDisplay
              editorState={this.props.markData.editorContent}/>
          </div>

        </div>
        <div
          className={classnames(styles.boxInteraction)}>
          {
            this.state.message &&
            <span className={classnames(stylesFont.fontContent, stylesFont.colorEditBlack)}>
              {this.state.message}
            </span>
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
