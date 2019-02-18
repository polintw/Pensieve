import React from 'react';

export default class MaskProcessing extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }



  render(){
    return(
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left:'0',
          backgroundColor: 'rgba(230,230,230,0.5)'
        }}
        onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
      </div>
    )
  }
}
