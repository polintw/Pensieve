import React from 'react';
import CreateShare from '../Component/CreateShare.jsx';

export default class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sharedList: [],
      sharedDataSet: {}
    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      div_Pages_Shared: {
        width: '76%',
        position: 'absolute',
        top: '16%',
        left: '50%',
        transform: 'translate(-50%, 0)'
      }
    }
  }

  _submit_Share_New(dataObj){
    this.setState((prevState, props) => {
      prevState.sharedList.push(dataObj.submitTime);
      prevState.sharedDataSet[dataobj.submitTime] = dataObj
      return prevState;
    });
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let shares = self.state.sharedList.map(function(dataKey, index){
      let dataValue = self.state.sharedDataSet[dataKey];
      return(
        <div
          style={}
          onClick={this._handleClick_Share}>
          <img
            src={dataValue.coverBase64}
            style={}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.div_Pages_Shared}>
        <CreateShare
            _submit_Share_New={this._submit_Share_New}/>
        <div>
          {shares}
        </div>
      </div>
    )
  }
}
