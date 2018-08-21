import React from 'react';
import Shared from './Shared.jsx';
import Collection from './Collection.jsx';

export default class CogMutual extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogMutual_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogMutual_}>
        <div>

        </div>
      </div>
    )
  }
}
