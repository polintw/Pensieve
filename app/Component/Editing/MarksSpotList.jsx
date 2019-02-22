import React from 'react';

export default class MarksSpotList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.Com_MarksSpotList_div = React.createRef();
    this._handleClick_MarkNumber = this._handleClick_MarkNumber.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this.style={
      Com_MarksSpotList_div: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        cursor: 'crosshair'
      },
      Com_MarksSpotList_div_svg_: {
        width: '3vw',
        height: '3vw',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_MarkNumber(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markExpand(event.currentTarget.getAttribute('markkey'));//notice! this attribute is write in lower case
  }

  _handleClick_SpotsLayer(event){
    event.stopPropagation();
    event.preventDefault();
    let originalCoordinate = {
      clickX : event.clientX,
      clickY : event.clientY,
      holdingLeft: this.Com_MarksSpotList_div.current.getBoundingClientRect().left,
      holdingTop: this.Com_MarksSpotList_div.current.getBoundingClientRect().top,
      holdingWidth: this.Com_MarksSpotList_div.current.clientWidth,
      holdingHeight: this.Com_MarksSpotList_div.current.clientHeight
    };

    let portionCoordinate = {
      top: ((originalCoordinate.clickY-originalCoordinate.holdingTop)/originalCoordinate.holdingHeight*100),
      left: ((originalCoordinate.clickX-originalCoordinate.holdingLeft)/originalCoordinate.holdingWidth*100)
    };
    this.props._set_markNewSpot(portionCoordinate);
  }

  render(){
    const self = this;
    let marksSpot = this.props.marksList.map(function(markKey, index){
      let coordinate = self.props.markCircles[markKey];
      return(
        <svg
          key={'key_Com_MarksSpotList_div_svg_'+index}
          markkey={markKey}
          style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_MarksSpotList_div_svg_)}
          onClick={self._handleClick_MarkNumber}>
          <defs><style>{".cls-1{fill:#FAFAFA;stroke:#FAFAFA;strokeWidth:1.2px;fontSize:3.6vh;}"}</style></defs>
          <text x="50%" y="50%" textAnchor="middle" className='cls-1'>{index}</text>
          <circle r="20" cx="50%" cy="50%" stroke='#FAFAFA' fill="transparent" style={{cursor: 'pointer'}}/>
        </svg>
      )
    });

    return(
      <div
        ref={this.Com_MarksSpotList_div}
        style={Object.assign({width: this.props.frame.width, height: this.props.frame.height}, this.style.Com_MarksSpotList_div)}
        onClick={this._handleClick_SpotsLayer}>
        {marksSpot}
      </div>
    )
  }
}
