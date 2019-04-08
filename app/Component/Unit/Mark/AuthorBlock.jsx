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
        minWidth: '49%',
        height: '100%',
        position: 'relative',
        padding: '3% 2% 2% 0',
        overflowY: 'visible'
      },
      Com_AuthorBlock_content_: {
        display: 'inline-block',
        maxWidth: '100%',
        minHeight: '68%',
        maxHeight: '156%', //the target MaxHeight is 64%, limit by parent
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        paddingBottom: '7%',
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
        boxSizing: 'border-box'
      },
      Com_AuthorBlock_credits_: {
        width: '100%',
        height: '16%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%'
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
      Com_AuthorBlock_panel_interaction_inspired_:{
        display: 'inline-block',
        minWidth: '70px',
        height: '100%',
        position: 'absolute',
        left: '0',
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
    return(
      <div
        style={Object.assign({}, this.style.Com_AuthorBlock_, {float: this.props.toCircleLeft? 'right':'left'})}>
        <div
          style={this.style.Com_AuthorBlock_content_}>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={this.style.Com_AuthorBlock_panel_}>
          <div
            style={this.style.Com_AuthorBlock_panel_interaction_}>
            <div
              style={this.style.Com_AuthorBlock_panel_interaction_inspired_}>
              <div
                style={Object.assign({}, this.style.Com_AuthorBlock_panel_interaction_bulb, {stroke: '#f7f4bc', fill: 'transparent'})}>
                <SvgBulbPlainHalf/>
              </div>
              <span
                style={Object.assign({}, styleMiddle.spanInteractions, this.style.Com_AuthorBlock_panel_interaction_count)}>
                {this.props.unitCurrent.marksInteraction[this.props.markKey].inspired+"/"}</span>
            </div>
            <span
              style={styleMiddle.spanInteractions}
              onClick={this._handleClick_openDialogue}>
              {'raise hand'}
            </span>
          </div>
        </div>
        <div
          style={this.style.Com_AuthorBlock_credits_}>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
        </div>
        <div
          style={{display: 'inline-block'}}>
          {"(多行參考資料連結)"}
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
