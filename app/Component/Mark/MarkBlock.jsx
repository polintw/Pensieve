import React from 'react';
import MarkBlockViewer from './MarkBlockViewer.jsx';

export default class MarkBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._css_calculate_MarkBlockPosition = this._css_calculate_MarkBlockPosition.bind(this);
    this.style = {

    };
  }

  _css_calculate_MarkBlockPosition(){
    let [left, top, right] = [null,null,null];
    let coordinate = this.props.markData.markCoordinate;
    coordinate.left>50 ? right = (100-coordinate.left)+'%' : left = coordinate.left+'%';
    top = (coordinate.top) * (30) / (100) + '%';

    return(
      {
        width: this.state.dialogue?'36vw':'34vw',
        height: '52vh',
        position: 'absolute',
        top: top,
        left: left,
        right: right,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        boxShadow: '0 0 4vw rgba(25,25,25,0.6)'
      }
    )
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        style={this._css_calculate_MarkBlockPosition()}>
        <MarkBlockViewer
          markKey={this.props.markKey}
          markData={this.props.markData}/>
      </div>
    )
  }
}
