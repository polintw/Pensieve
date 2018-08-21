import React from 'react';
import Shared from './Shared.jsx';
import Collection from './Collection.jsx';

export default class CogStorage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_CogStorage =this._render_CogStorage.bind(this);
    this.style={
      selfCom_CogStorage_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _render_CogStorage(){
    switch (this.props.range) {
      case "shared":
        return (
          <Shared/>
        )
        break;
      case "collection":
        return (
          <Collection/>
        )
        break;
      case "inspired":
        return
        break;
      default:
        return
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogStorage_}>
        <div>
          {this._render_CogStorage()}
        </div>
      </div>
    )
  }
}
