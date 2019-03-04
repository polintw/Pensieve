import React from 'react';
import MarkBlock from './Mark/MarkBlock.jsx';

export default class ImgLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      marksify: true,
      circleNr: this.props.initMark,
      circlesDOM: []
    };
    this._set_circles = this._set_circles.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this.style = {
      absolute_FullVersion: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left:'0',
        boxSizing: 'border-box'
      },
      Com_ImgLayer_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      },
      Com_ImgLayer_MarkBlock_: {
        width: '42%',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)'
      },
      Com_ImgLayer_div: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      Com_ImgLayer_div_circle_svg: {
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
    const self = this,
    imgWidth = self.Com_ImgLayer_img.clientWidth,
    imgHeight = self.Com_ImgLayer_img.clientHeight;
    let circlesArr = [];
    if(this.state.circleNr == 'all'){
      circlesArr = self.props.marksData.list.map(function(id, index){
        const coordinate = {top: self.props.marksData.data[id].top, left: self.props.marksData.data[id].left};
        return(
          <svg
            key={'key_ImgLayer_div_circle_svg_all_'+index}
            id={id}
            index={index}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
            onClick={self._handleClick_ImgLayer_circle}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
        )
      });
      this.setState({
        circlesDOM: (
          <div
            style={Object.assign(
              {width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}>
            {circlesArr}
          </div>
        )
      });
    }else{
      const markId = self.state.circleNr;
      const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
      let [left, top, right] = [null,null,null];

      let axisPx = ((coordinate.left/100)*imgWidth)-(imgWidth/2);
      coordinate.left>50 ? right = (this.Com_ImgLayer.clientWidth/2)-axisPx+15 : left = (this.Com_ImgLayer.clientWidth/2)+axisPx+15;
      top = (22 + (coordinate.top) * (34) / (100)) + '%';

      circlesArr.push(
        <div
          key={'key_ImgLayer_div_circle_svg_markBlock_'+markId}>
          <div
            style={Object.assign(
              {width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}>
            <svg
              id={markId}
              style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
              onClick={self._handleClick_ImgLayer_circle}>
              <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
            </svg>
          </div>
          <div
            style={Object.assign({backgroundColor: 'rgba(30,30,30,0.2)'}, self.style.absolute_FullVersion)}
            onClick={self._handleClick_SpotsLayer}></div>
          <div
            style={Object.assign({top: top, left: left, right: right}, self.style.Com_ImgLayer_MarkBlock_)}>
            <MarkBlock
              markKey={markId}
              markData={self.props.marksData.data[markId]}/>
          </div>
        </div>
      )
      this.setState({circlesDOM: circlesArr});
    }
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let currentId = event.currentTarget.getAttribute('id');
    if(currentId == this.state.circleNr){
      this.setState((prevState, props)=>{return {circleNr: 'all'};}, this._set_circles);
    }else{
      this.setState((prevState, props)=>{return {circleNr: currentId};}, this._set_circles);
    }
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return {circleNr: 'all'};}, this._set_circles);
  }

  render(){
    return(
      <div
        style={this.style.absolute_FullVersion}
        ref={(element) => {this.Com_ImgLayer = element;}}>
        <img
          style={this.style.Com_ImgLayer_img}
          ref={(element) => {this.Com_ImgLayer_img = element;}}
          src={this.props.imgSrc}
          onLoad={this._set_circles}/>
        {
          this.state.marksify && this.props.lockify &&
          this.state.circlesDOM
        }
      </div>
    )
  }
}
