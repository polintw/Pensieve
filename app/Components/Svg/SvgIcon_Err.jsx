import React from 'react';

export default class IconError extends React.Component {
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
            <g id="status" transform="translate(-341.000000, -400.000000)">
                <g id="icon/error" transform="translate(341.000000, 400.000000)">
                    <g id="fault">
                        <circle id="Oval" fill="#EB584E" cx="10" cy="10" r="10"></circle>
                        <g id="Group" transform="translate(6.000000, 6.000000)" stroke="#FFFFFF" strokeLinecap="square" strokeWidth="2">
                            <line x1="0.5" y1="0.5" x2="7.5" y2="7.5" id="Line-2"></line>
                            <line x1="0.5" y1="0.5" x2="7.5" y2="7.5" id="Line-2" transform="translate(4.000000, 4.000000) scale(-1, 1) translate(-4.000000, -4.000000) "></line>
                        </g>
                    </g>
                </g>
            </g>
        </g>

      </svg>
    )
  }
}
