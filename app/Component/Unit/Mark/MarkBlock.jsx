import React from 'react';
import DraftDisplay from '../../DraftDisplay.jsx';

export default class MarkBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this.style = {
      Com_MarkBlock_: {
        width: '100%',
        minHeight: '44vh',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        boxShadow: '0 0 4vw rgba(25,25,25,0.6)'
      },
      Com_MarkBlock_content_: {
        width: '100%',
        minHeight: '22vh',
        maxHeight: '60vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
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
        style={this.style.Com_MarkBlock_}>
        <div
          style={this.style.Com_MarkBlock_content_}>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
      </div>
    )
  }
}
