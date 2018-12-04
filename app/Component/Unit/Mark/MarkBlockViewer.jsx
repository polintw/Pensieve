import React from 'react';
import DraftDisplay from '../../DraftDisplay.jsx';

export default class MarkBlockViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this.style = {
      Com_MarkBlockViewer_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlockViewer_content_: {
        display: 'inline-block',
        width: '21vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0'
      },
      Com_MarkBlockViewer_content_editor_: {
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
      Com_MarkBlockViewer_side_: {
        display: 'inline-block',
        width: '12vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      Com_MarkBlockViewer_side_thanks_: {
        display: 'inline-block',
        width: '100%',
        height: '10%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      }
    };
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
        style={this.style.Com_MarkBlockViewer_}>
        <div
          style={this.style.Com_MarkBlockViewer_content_}>
          <div
            style={this.style.Com_MarkBlockViewer_content_editor_}>
            <DraftDisplay
              editorState={this.props.markData.editorContent}/>
          </div>
        </div>
        <div
          style={this.style.Com_MarkBlockViewer_side_}>
          <div
            style={this.style.Com_MarkBlockViewer_side_thanks_}>
            <span>{'編輯紀錄'}</span>
          </div>
        </div>
      </div>
    )
  }
}
