import React from 'react';

export default class IconChecked extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg
        viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        style={Object.assign({}, {
          maxHeight: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        {/*Generator: sketchtool 61.2 (101010) - https://sketch.com*/}
        <g id="Sign-up/log-in" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="status" transform="translate(-859.000000, -316.000000)">
                <g id="icon/check" transform="translate(859.000000, 316.000000)">
                    <g id="check">
                        <circle id="Oval" fill="#19A796" cx="10" cy="10" r="10"></circle>
                        <polyline id="Path-2" stroke="#FFFFFF" strokeWidth="2" points="6 10.4285714 8.7 13 15 7"></polyline>
                    </g>
                </g>
            </g>
        </g>

      </svg>
    )
  }
}
