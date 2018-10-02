import React from 'react';
import AppearPath from './AppearPath.jsx';

export default class Appearance extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Appearance_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Com_Appearance_main_: {
        width: '100%',
        minHeight: '24vh',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      Com_Appearance_nav_: {
          width: '100%',
          height: '6vh',
          boxSizing: 'border-box',
          margin: '2vh 0'
      }
    }
  }

  componentDidMount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_Appearance_}>
        <div
            style={this.style.Com_Appearance_nav_}>
            <div style={{display: 'inline-block'}}>{"Path"}</div>
            <div style={{display: 'inline-block'}}>{"Series"}</div>
            <div style={{display: 'inline-block'}}>{"Info"}</div>
        </div>
        <div
          style={this.style.Com_Appearance_main_}>
          <AppearPath
            userBasic={this.props.userBasic}
            urlParam={this.props.urlParam}
            urlQuery={this.props.urlQuery}/>
        </div>
      </div>
    )
  }
}
