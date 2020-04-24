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
      backgroundColor: "rgba(105, 105, 105, 0.77)"
    };
    if(this.props.style){
      Object.assign(style, this.props.style)
    }

    return(
      <div className={this.props.className} style={style}
        onClick={(event) => {
          event.stopPropagation();
          /*
          NOTICE! Do not set prevetdefault on this component! <form>、<input> etc. inside any children need it.
         event.preventDefault(); */
          this.props.onClose();}}>
        <div
          onClick={(event) => {
             /*
             NOTICE! Do not set prevetdefault on this component! <form>、<input> etc. inside any children need it.
            event.preventDefault(); */
            event.stopPropagation();}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
