import React from 'react';

export class SvgArrowToTop extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = !!this.props.customStyles ? this.props.mouseOn ? this.props.customStyles.fillColorMouseOn: this.props.customStyles.fillColor : "black"; // reaction if on mouse enter
    /* it's a mirror from 'toRight' arrow */
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 29"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          transform: 'rotate(-90deg)' // rotate from 'toRight' arrow
        })}>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path
              fill={fillColor}
              d="M2.5,29a2.5,2.5,0,0,1-1.24-4.67l17.2-9.83L1.26,4.67A2.5,2.5,0,0,1,3.74.33l21,12a2.5,2.5,0,0,1,0,4.34l-21,12A2.53,2.53,0,0,1,2.5,29Z"/>
          </g>
        </g>
      </svg>

    )
  }
}

export class SvgArrowToLeft extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = !!this.props.customStyles ? this.props.mouseOn ? this.props.customStyles.fillColorMouseOn: this.props.customStyles.fillColor : "black"; // reaction if on mouse enter
    /* it's a mirror from 'toRight' arrow */
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 29"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          transform: 'scale(-1, 1)' // mirror the 'toRight' arrow
        })}>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path
              fill={fillColor}
              d="M2.5,29a2.5,2.5,0,0,1-1.24-4.67l17.2-9.83L1.26,4.67A2.5,2.5,0,0,1,3.74.33l21,12a2.5,2.5,0,0,1,0,4.34l-21,12A2.53,2.53,0,0,1,2.5,29Z"/>
          </g>
        </g>
      </svg>

    )
  }
}

export class SvgArrowToRight extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = !!this.props.customStyles ? this.props.mouseOn ? this.props.customStyles.fillColorMouseOn: this.props.customStyles.fillColor : "black"; // reaction if on mouse enter

    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 29"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <path
              fill={fillColor}
              d="M2.5,29a2.5,2.5,0,0,1-1.24-4.67l17.2-9.83L1.26,4.67A2.5,2.5,0,0,1,3.74.33l21,12a2.5,2.5,0,0,1,0,4.34l-21,12A2.53,2.53,0,0,1,2.5,29Z"/>
          </g>
        </g>
      </svg>

    )
  }
}
