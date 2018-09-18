import React from 'react';
import cxBind from 'classnames/bind';
import WithinLtd from './Within_Ltd.jsx';
import WithinCosmic from './Within_Cosmic.jsx';

export default class Within extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic,
      pages: 'ltd'
    };
    this._set_Pages = this._set_Pages.bind(this);
    this._render_WithinPages = this._render_WithinPages.bind(this);
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Within_pages_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    };
  }

  _set_Pages(page){
    this.setState({pages: page})
  }

  _render_WithinPages(){
    switch (this.state.pages) {
      case 'ltd':
        return(
          <div
            style={this.style.Within_pages_}>
            <WithinLtd
              userBasic={this.state.userBasic}
              _set_Pages={this._set_Pages}/>
          </div>
        )
        break;
      case "cosmic":
        return(
          <div
            style={this.style.Within_pages_}>
            <WithinCosmic
              userBasic={this.state.userBasic}
              _set_Pages={this._set_Pages}/>
          </div>
        )
        break;
      default:
      return(
        <div
          style={this.style.Within_pages_}>
          <WithinLtd
            userBasic={this.state.userBasic}
            _set_Pages={this._set_Pages}/>
        </div>
      )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.div_Base}>
        {this._render_WithinPages()}
      </div>
    )
  }
}
