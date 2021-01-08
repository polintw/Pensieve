import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../../stylesFont.module.css';
import stylesOpenedMark from "../../styles.module.css";
import DraftDisplay from '../../../../Components/Draft/DraftDisplay.jsx';
import {
  SvgArrowToLeft,
  SvgArrowToRight
} from '../../../../Components/Svg/SvgArrow.jsx';

class ViewerBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: false,
      onArrowRight: false,
      onArrowLeft: false
    };
    this.boxContent = React.createRef();
    this.comViewerBlock = React.createRef();
    this._set_stateDefault = ()=>{this.setState({message: false})};
    this._set_BlockMessage = this._set_BlockMessage.bind(this);
    this._handleWheel_boxContent = (event)=>{event.stopPropagation();};
    this._handleClick_blockPanel_cancel = this._handleClick_blockPanel_cancel.bind(this);
    this._handleOver_ArrowRight = this._handleOver_ArrowRight.bind(this);
    this._handleOut_ArrowRight = this._handleOut_ArrowRight.bind(this);
    this._handleOver_ArrowLeft = this._handleOver_ArrowLeft.bind(this);
    this._handleOut_ArrowLeft = this._handleOut_ArrowLeft.bind(this);
    this.style = {
      Com_ViewerBlock_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        width: '100%',
        boxSizing: 'border-box',
      },
    };
  }

  _handleClick_blockPanel_cancel(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Markvisible(false);
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
            className={classnames(
              styles.boxDraftDisplay, 'lineHeight15', "colorEditBlack",
              this.props.draggableCancelToken // this one, is to match the <Draggable/> comp used in OpenedMark
            )}
            onTouchStart={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
            onTouchEnd={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
            style={{fontSize: '1.5rem'}}>
            <DraftDisplay
              editorState={this.props.markData.editorContent}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxInteraction)}>
          {
            this.state.message &&
            <span className={classnames(
                "fontContent", "colorEditBlack",
                this.props.draggableCancelToken // this one, is to match the <Draggable/> comp used in OpenedMark
              )}
              onTouchStart={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
              onTouchEnd={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
              >
              {this.state.message}
            </span>
          }
          <div>
            {
              (this.props.currentSerial > 0) &&
              <div
                className={classnames(
                  styles.boxSvgArrow,
                  {[styles.boxSvgArrowMouseover]: this.state.onArrowLeft},
                  this.props.draggableCancelToken // this one, is to match the <Draggable/> comp used in OpenedMark
                )}
                onTouchStart={(e)=>{ e.stopPropagation(); /* this one, is to match the <Draggable/> comp used in OpenedMark */ this.setState({onArrowLeft: true});}}
                onTouchEnd={(e)=>{ e.stopPropagation(); /* this one, is to match the <Draggable/> comp used in OpenedMark */ this.setState({onArrowLeft: false}); }}
                onMouseOver={this._handleOver_ArrowLeft}
                onMouseOut={this._handleOut_ArrowLeft}
                onClick={(e)=> {e.stopPropagation(); e.preventDefault(); this.props._set_markJump('previous', this.props.currentSerial)}}>
                <div
                  style={{width: "12px", height: "12px"}}>
                  <SvgArrowToLeft
                    mouseOn={this.state.onArrowLeft}
                    customStyles={{fillColorMouseOn: '#444444', fillColor: '#a3a3a3'}}/>
                </div>
              </div>
            }
            <div
              className={classnames(
                styles.boxSvgArrow,
                {[styles.boxSvgArrowMouseover]: this.state.onArrowRight},
                this.props.draggableCancelToken // this one, is to match the <Draggable/> comp used in OpenedMark
              )}
              onTouchStart={(e)=>{ e.stopPropagation(); /* this one, is to match the <Draggable/> comp used in OpenedMark */ this.setState({onArrowRight: true});}}
              onTouchEnd={(e)=>{ e.stopPropagation(); /* this one, is to match the <Draggable/> comp used in OpenedMark */ this.setState({onArrowRight: false}); }}
              onMouseOver={this._handleOver_ArrowRight}
              onMouseOut={this._handleOut_ArrowRight}
              onClick={(e)=> {e.stopPropagation(); e.preventDefault(); this.props._set_markJump('next', this.props.currentSerial)}}>
              <div
                style={{width: "12px", height: "12px"}}>
                <SvgArrowToRight
                  mouseOn={this.state.onArrowRight}
                  customStyles={{fillColorMouseOn: '#444444', fillColor: '#a3a3a3'}}/>
              </div>
            </div>
          </div>
        </div>
        {
          !(this.props.boxWidth > 420) && //a way to detect small screen, like cell phone
          <div className={stylesOpenedMark.boxBlockBack}>
            <span
              className={classnames(
                stylesFont.colorDarkGrey,
                this.props.draggableCancelToken // this one, is to match the <Draggable/> comp used in OpenedMark
              )}
              style={{fontSize: '0.8rem'}}
              onTouchStart={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
              onTouchEnd={(e)=>{ e.stopPropagation();} /* this one, is to match the <Draggable/> comp used in OpenedMark */}
              onClick={this._handleClick_blockPanel_cancel}>
              {" ╳ "}
            </span>
          </div>
        }

      </div>
    )
  }

  _handleOver_ArrowLeft(e) {
    e.stopPropagation(); e.preventDefault();
    if (this.props.currentSerial == 0) return; // no effect at the first Mark

    this.setState((prevState, index)=>{
      return {
        onArrowLeft: true
      }
    })
  }

  _handleOut_ArrowLeft(e) {
    e.stopPropagation(); e.preventDefault();
    if (this.props.currentSerial == 0) return; // no effect at the first Mark

    this.setState((prevState, index)=>{
      return {
        onArrowLeft: false
      }
    })
  }

  _handleOver_ArrowRight(e) {
    e.stopPropagation(); e.preventDefault();
    this.setState((prevState, index)=>{
      return {
        onArrowRight: true
      }
    })
  }

  _handleOut_ArrowRight(e) {
    e.stopPropagation(); e.preventDefault();
    this.setState((prevState, index)=>{
      return {
        onArrowRight: false
      }
    })
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
