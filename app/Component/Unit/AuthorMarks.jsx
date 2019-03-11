import React from 'react';
import { connect } from "react-redux";
import MarkBlock from './Mark/MarkBlock.jsx';

class AuthorMarks extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_SpotsorMark = this._render_SpotsorMark.bind(this);
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
      Com_ImgLayer_MarkBlock_: {
        width: '42%',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)'
      },
      Com_ImgLayer_div: {
        position: 'absolute',
        top: '50%',
        right: '40%',
        transform: 'translate(40%,-50%)'
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

  _render_SpotsorMark(){
    const self = this,
    imgWidth = this.props.imgWidthHeight.width,
    imgHeight = this.props.imgWidthHeight.height;

    if(this.props.markOpened && (this.props.marksData.list.indexOf(this.props.currentMark) > (-1))){
      const markId = this.props.currentMark;
      const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
      let [left, top, right] = [null,null,null];

      let axisPx = ((coordinate.left/100)*imgWidth)-(imgWidth/2);
      coordinate.left>50 ? right = (this.Com_ImgLayer.clientWidth/2)-axisPx+15 : left = (this.Com_ImgLayer.clientWidth/2)+axisPx+15;
      top = (22 + (coordinate.top) * (34) / (100)) + '%';

      return (
        <div>
          <div
            style={Object.assign({backgroundColor: 'rgba(30,30,30,0.2)'}, self.style.absolute_FullVersion)}
            onClick={self._handleClick_ImgLayer_circle}/>
          <div
            style={Object.assign(
              {width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}
              onClick={self._handleClick_ImgLayer_circle}>
            <svg
              id={markId}
              style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
              onClick={self._handleClick_ImgLayer_circle}>
              <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
            </svg>
          </div>
          <div
            style={Object.assign({top: top, left: left, right: right}, self.style.Com_ImgLayer_MarkBlock_)}>
            <MarkBlock
              markKey={markId}
              markData={self.props.marksData.data[markId]}/>
          </div>
        </div>
      ) // order, is important
    }else{
      let circlesArr = self.props.marksData.list.map(function(id, index){
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
      return (
        <div
          style={Object.assign({width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}>
            {circlesArr}
        </div>
      );
    }
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let param = this.props.markOpened ? (false) : (event.currentTarget.getAttribute('id'));
    this.props._set_Markvisible(param);
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_spotsVisible();
  }

  render(){
    return(
      <div
        style={this.style.absolute_FullVersion}
        ref={(element) => {this.Com_ImgLayer = element;}}
        onClick={this._handleClick_SpotsLayer}>
        {
          this.props.spotsVisible &&
          this._render_SpotsorMark()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(AuthorMarks);
