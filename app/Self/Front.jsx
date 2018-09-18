import React from 'react';
import cxBind from 'classnames/bind';
import FrontCognition from './Front_Cognition.jsx';
import FrontStatics from './Front_Statics.jsx';
import ExternalPanel from './../Component/ExternalPanel.jsx';

export default class Front extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      frontPage: 'cognition'
    };
    this._set_frontPage = (pageTo)=>{this.setState({frontPage: pageTo});};
    this._render_Page_Front = this._render_Page_Front.bind(this);
    this.style={
      Self_pages_Front_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_pages_FrontPage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_pages_Front_External_: {
        width: '6%',
        height: '24%',
        position: 'fixed',
        top: '63%',
        right: '2%'
      }
    }
  }

  _render_Page_Front(){
    switch (this.state.frontPage) {
      case "cognition":
        return (
          <div
            style={this.style.Self_pages_FrontPage}>
            <FrontCognition
              userBasic={this.props.userBasic}
              _set_frontPage={this._set_frontPage}/>
          </div>
        )
        break;
      case "statics":
        return (
          <div
            style={this.style.Self_pages_FrontPage}>
            <FrontStatics
              userBasic={this.props.userBasic}
              _set_frontPage={this._set_frontPage}/>
          </div>
        )
        break;
      default:
        return (
          <div
            style={this.style.Self_pages_Front_Cognition}>
            <FrontCognition
              userBasic={this.props.userBasic}
              _set_frontPage={this._set_frontPage}/>
          </div>
        )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Self_pages_Front_}>
        {this._render_Page_Front()}
        <div
          style={this.style.Self_pages_Front_External_}>
          <ExternalPanel/>
        </div>
      </div>
    )
  }
}
