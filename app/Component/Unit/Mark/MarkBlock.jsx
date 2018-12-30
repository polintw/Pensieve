import React from 'react';
import MarkBlockViewer from './MarkBlockViewer.jsx';

export default class MarkBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
      }
    };
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_MarkBlock_}>
        <MarkBlockViewer
          markKey={this.props.markKey}
          markData={this.props.markData}/>
      </div>
    )
  }
}
