import React from 'react';

export default class ModalBackground extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let style = {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0%",
      left: 0,
      backgroundColor: "rgba(105, 105, 105, 0.77)",
      zIndex: '7' // basically all the main page was set to '3' up to the "root" <div>
    };
    if(this.props.style){
      Object.assign(style, this.props.style)
    }

    return(
      <div className={this.props.className} style={style} onClick={(event) => {event.stopPropagation();event.preventDefault();this.props.onClose();}}>
        <div onClick={(event) => {event.preventDefault(); event.stopPropagation();}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
