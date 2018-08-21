import React from 'react';
import MarkBlock from './MarkBlock.jsx';

export default class UnitLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      circleNr: 'all',
      marksKey: [],
      marksDOM: []
    };
    this._set_makrsDOM = this._set_makrsDOM.bind(this);
    this._handleLoaded_Img = this._handleLoaded_Img.bind(this);
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

  _handleLoaded_Img(){
    this.setState((prevState, props)=>{
      let marksKey = Object.keys(this.props.marksData);
      return {marksKey: marksKey};
    }, this._set_makrsDOM)
  }

  _set_makrsDOM(){
    const self = this;
    let marksArr = [];
    if(this.state.circleNr == 'all'){
      marksArr = self.state.marksKey.map(function(id, index){
        const coordinate = self.props.marksData[id].markCoordinate;
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
        marksDOM: (
          <div
            style={Object.assign(
              {width: self.Com_UnitLayer_img.clientWidth, height: self.Com_UnitLayer_img.clientHeight}, self.style.Com_UnitLayer_div)}>
            {marksArr}
          </div>
        )
      });
    }else{
      let markId = self.state.circleNr;
      const coordinate = this.props.marksData[markId].markCoordinate;
      marksArr.push(
        <div
          key={'key_UnitLayer_div_circle_svg_markBlock_'+markId}
          style={Object.assign(
            {width: self.Com_UnitLayer_img.clientWidth, height: self.Com_UnitLayer_img.clientHeight}, self.style.Com_UnitLayer_div)}>
          <svg
            id={markId}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_UnitLayer_div_circle_svg)}
            onClick={self._handleClick_UnitLayer_circle}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
          <MarkBlock
            markKey={markId}
            identity={self.props.identity}
            markData={self.props.marksData[markId]}/>
        </div>
      )
      this.setState({marksDOM: marksArr});
    }
  }

  _handleClick_UnitLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let currentId = event.currentTarget.getAttribute('id');
    if(currentId == this.state.circleNr){
      this.setState((prevState, props)=>{return {circleNr: 'all'};}, this._set_makrsDOM);
    }else{
      this.setState((prevState, props)=>{return {circleNr: currentId};}, this._set_makrsDOM);
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_UnitLayer}>
        <img
          style={this.style.Com_UnitLayer_img}
          ref={(element) => {this.Com_UnitLayer_img = element;}}
          src={this.props.imgSrc}
          onLoad={this._handleLoaded_Img}/>
        {
          this.props.marks &&
          this.state.marksDOM
        }
      </div>
    )
  }
}
