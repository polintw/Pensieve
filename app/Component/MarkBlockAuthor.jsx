import React from 'react';
import MarkDialogue from './MarkDialogue.jsx';
import MarkAuthorThreads from './MarkAuthorThreads.jsx';
import DraftDisplay from './DraftDisplay.jsx';

export default class MarkBlockAuthor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      dialogue: false,
      threadFocus: null
    };
    this._set_openDialogue = this._set_openDialogue.bind(this);
    this.style = {
      Com_MarkBlockAuthor_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlockAuthor_content_: {
        display: 'inline-block',
        width: '21vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0'
      },
      Com_MarkBlockAuthor_content_editor_: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2% 2% 2% 3%',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlockAuthor_content_panel_: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_MarkBlockAuthor_dialogue_: {
        display: 'inline-block',
        width: '13vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '21vw',
        boxSizing: 'border-box',
        padding: '2% 3%',
        borderLeft: 'solid 1px white',
        color: '#FAFAFA',
      },
      Com_MarkBlockAuthor_side_: {
        display: 'inline-block',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      Com_MarkBlockAuthor_side_thanks_: {
        display: 'inline-block',
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      }
    };
  }

  _set_openDialogue(threadId){
    this.setState((prevState, props)=>{return {threadFocus: threadId, dialogue: this.state.dialogue ? false : true};})
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_MarkBlockAuthor_}>
        <div
          style={this.style.Com_MarkBlockAuthor_content_}>
          <div
            style={this.style.Com_MarkBlockAuthor_content_editor_}>
            <DraftDisplay
              editorState={this.props.markData.markEditorContent}/>
          </div>
          <div
            style={this.style.Com_MarkBlockAuthor_content_panel_}>
            <span>{'編輯紀錄'}</span>

          </div>
        </div>
        <div>
          <MarkAuthorThreads
              markKey={this.props.markKey}
              _set_openDialogue={this._set_openDialogue}/>
        </div>
        {
          this.state.dialogue &&
          <div
            style={this.style.Com_MarkBlockAuthor_dialogue_}>
            <MarkDialogue
              markKey={this.props.markKey}
              threadId={this.state.threadFocus}/>
          </div>
        }
        <div
          style={
            Object.assign({width: '2vw'}, this.style.Com_MarkBlockAuthor_side_)}>
          <div
            style={this.style.Com_MarkBlockAuthor_side_thanks_}>

          </div>
        </div>
      </div>
    )
  }
}
