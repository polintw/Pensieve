import React from 'react';

export default class SvgPin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    let fillColor = this.props.mouseOn ? !!this.props.customStyles ? this.props.customStyles.fillColor: "#545454" : "#D8D8D8"; // reaction if on mouse enter
    // the 'fillColor above is not a good name, it's specificly used by Nails.
    // so we use a second system to 'overwrite' for those nwe comp using this comp
    let stroke = 'none', strokeWidth = "1";
    if( !!this.props.assignStyles) {
      fillColor = !!this.props.assignStyles.fill ? this.props.assignStyles.fill : fillColor;
      stroke = !!this.props.assignStyles.stroke ? this.props.assignStyles.stroke : stroke;
      fillColor = !!this.props.assignStyles.strokeWidth ? this.props.assignStyles.strokeWidth : strokeWidth;
    };

    return(
      <svg
        viewBox="0 0 11 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'visible'
        })}>
        {/*Generator: sketchtool 61.2 (101010) - https://sketch.com*/}
        <g id="Dashboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="homepage/hover" transform="translate(-194.000000, -192.000000)">
            <g id="Group-15" transform="translate(164.000000, 165.000000)">
              <g id="PIN" transform="translate(20.000000, 20.000000)">
                <path
                  d="M15.5,7 C12.4673575,7 10,9.39259375 10,12.3333438 C10,13.2161563 10.2276158,14.0914688 10.660321,14.8678438 L15.1992301,22.828125 C15.2596548,22.93425 15.3748,23 15.5,23 C15.6252,23 15.7403452,22.93425 15.8007699,22.828125 L20.3413548,14.8652188 C20.7723842,14.0914688 21,13.216125 21,12.3333125 C21,9.39259375 18.5326425,7 15.5,7 Z M15.5,15 C13.9836787,15 12.7500161,13.8037187 12.7500161,12.3333438 C12.7500161,10.8629688 13.9836787,9.6666875 15.5,9.6666875 C17.0163213,9.6666875 18.2499839,10.8629688 18.2499839,12.3333438 C18.2499839,13.8037187 17.0163213,15 15.5,15 Z"
                  id="Shape"
                  fill={fillColor}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  fillRule="nonzero"></path>
                <rect id="Rectangle" x="0" y="0" width="30" height="30"></rect>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}
