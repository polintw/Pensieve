import React from 'react';
import MarkBlock from './Mark/MarkBlock.jsx';

export default class UnitLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      circleNr: this.props.initMark,
      circlesDOM: []
    };
    this._set_circles = this._set_circles.bind(this);
    this._handleClick_UnitLayer_circle = this._handleClick_UnitLayer_circle.bind(this)
    this.style = {
      Com_UnitLayer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left:'0'
      },
      Com_UnitLayer_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      },
      Com_UnitLayer_MarkBlock_: {
        width: '42%',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)'
      },
      Com_UnitLayer_div: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      Com_UnitLayer_div_circle_svg: {
        width: '3vw',
        height: '3vw',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
      },
    };
  }

  _set_circles(){
    const self = this;
    let circlesArr = [];
    if(this.state.circleNr == 'all'){
      circlesArr = self.props.marksData.list.map(function(id, index){
        const coordinate = {top: self.props.marksData.data[id].top, left: self.props.marksData.data[id].left};
        return(
          <svg
            key={'key_UnitLayer_div_circle_svg_all_'+index}
            id={id}
            index={index}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_UnitLayer_div_circle_svg)}
            onClick={self._handleClick_UnitLayer_circle}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
        )
      });
      this.setState({
        circlesDOM: (
          <div
            style={Object.assign(
              {width: self.Com_UnitLayer_img.clientWidth, height: self.Com_UnitLayer_img.clientHeight}, self.style.Com_UnitLayer_div)}>
            {circlesArr}
          </div>
        )
      });
    }else{
      const markId = self.state.circleNr;
      const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
      let imgWidth = self.Com_UnitLayer_img.clientWidth,
      imgHeight = self.Com_UnitLayer_img.clientHeight,
      [left, top, right] = [null,null,null];

      let delta = coordinate.left>50 ? (100-coordinate.left)/100 : coordinate.left/100;
      let axispx = (self.Com_UnitLayer.clientWidth * 0.5)-((imgWidth/2)-(delta * imgWidth))+10;
      coordinate.left>50 ? right = axispx : left = axispx ;
      top = (22 + (coordinate.top) * (34) / (100)) + '%';

      circlesArr.push(
        <div
          key={'key_UnitLayer_div_circle_svg_markBlock_'+markId}>
          <div
            style={Object.assign(
              {width: imgWidth, height: imgHeight}, self.style.Com_UnitLayer_div)}>
            <svg
              id={markId}
              style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_UnitLayer_div_circle_svg)}
              onClick={self._handleClick_UnitLayer_circle}>
              <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
            </svg>
          </div>
          <div
            style={Object.assign({top: top, left: left, right: right}, self.style.Com_UnitLayer_MarkBlock_)}>
            <MarkBlock
              markKey={markId}
              markData={self.props.marksData.data[markId]}/>
          </div>
        </div>
      )
      this.setState({circlesDOM: circlesArr});
    }
  }

  _handleClick_UnitLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let currentId = event.currentTarget.getAttribute('id');
    if(currentId == this.state.circleNr){
      this.setState((prevState, props)=>{return {circleNr: 'all'};}, this._set_circles);
    }else{
      this.setState((prevState, props)=>{return {circleNr: currentId};}, this._set_circles);
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_UnitLayer}
        ref={(element) => {this.Com_UnitLayer = element;}}>
        <img
          style={this.style.Com_UnitLayer_img}
          ref={(element) => {this.Com_UnitLayer_img = element;}}
          src={this.props.imgSrc}
          onLoad={this._set_circles}/>
        {
          this.props.marksify &&
          this.state.circlesDOM
        }
      </div>
    )
  }
}
