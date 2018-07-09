import React from 'react';
import MarkBlock from './MarkBlock.jsx';

export default class UnitLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      circleRender: false,
      circleNr: 'all'
    };
    this._render_makrCircles = this._render_makrCircles.bind(this);
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

  _render_makrCircles(){
    const self = this;
    let markCircles = [];
    if(this.state.circleNr == 'all'){
      markCircles = this.props.marksData.markCircles.map(function(coordinate, index){
        return(
          <svg
            key={'key_UnitLayer_div_circle_svg_all_'+index}
            index={index}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_UnitLayer_div_circle_svg)}
            onClick={self._handleClick_UnitLayer_circle}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
        )
      });
      return (
        <div
          style={Object.assign(
            {width: self.Com_UnitLayer_img.clientWidth, height: self.Com_UnitLayer_img.clientHeight}, self.style.Com_UnitLayer_div)}>
          {markCircles}
        </div>
      );
    }else{
      let coordinate = self.props.marksData.markCircles[self.state.circleNr];
      markCircles.push(
        <div
          key={'key_UnitLayer_div_circle_svg_markBlock_'+self.state.circleNr}
          style={Object.assign(
            {width: self.Com_UnitLayer_img.clientWidth, height: self.Com_UnitLayer_img.clientHeight}, self.style.Com_UnitLayer_div)}>
          <svg
            index={self.state.circleNr}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_UnitLayer_div_circle_svg)}
            onClick={self._handleClick_UnitLayer_circle}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
          <MarkBlock
            coordinate={coordinate}
            editorState={self.props.marksData.markEditorContent[self.state.circleNr]}/>
        </div>
      )
      return markCircles;
    }
  }

  _handleClick_UnitLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let currentNr = event.currentTarget.getAttribute('index');
    if(currentNr == this.state.circleNr){
      this.setState({circleNr: 'all'});
    }else{
      this.setState({circleNr: currentNr});
    }
  }

  componentDidMount(){
    //use this because we need width and height of mounted <img> element,
    if(this.props.marks){
      this.setState({circleRender: true});
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_UnitLayer}>
        <img
          style={this.style.Com_UnitLayer_img}
          ref={(element) => {this.Com_UnitLayer_img = element;}}
          src={this.props.imgSrc}/>
          {
            this.props.marks &&
            this.state.circleRender &&
            this._render_makrCircles()
          }
      </div>
    )
  }
}
