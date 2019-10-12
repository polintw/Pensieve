import React from 'react';
import {NounsList} from './NounsEditorCom.jsx';
import {SearchModule} from '../NodeComs.jsx';

export default class NounsEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nounsList: this.props.nouns.list,
      nounsBasic: this.props.nouns.basic
    };
    this._set_nodeChoice = this._set_nodeChoice.bind(this);
    this._set_nounDelete = this._set_nounDelete.bind(this);
    this.style={
      Com_Editing_NounsEditor__: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: '0',
        boxSizing: 'border-box'
      },
      Com_Editing_NounsEditor_List: {
        width: '100%',
        maxHeight: '240%',
        position: 'absolute',
        bottom: '3rem',
        left: '0',
        overflow: 'auto'
      },
      Com_Editing_NounsEditor_SearchModule: {
        width: '100%',
        height: '2.54rem',
        position: 'absolute',
        bottom: '0',
        left: '0'
      }
    }
  }

  _set_nodeChoice(nounBasic){
    let nounObj = Object.assign({}, nounBasic);
    this.setState((prevState, props)=>{
      //chekc the node passed from the SearchModule existed or not
      //a check for preventing repeating on list
      if(prevState.nounsList.indexOf(nounObj.id) < 0){
        //save to push to the list
        prevState.nounsList.push(nounObj.id);
        prevState.nounsBasic[nounObj.id] = nounObj;
      };

      return prevState;
    }, ()=>{
      this.props._set_nouns({list: this.state.nounsList, basic: this.state.nounsBasic});
    })
  }

  _set_nounDelete(nodeId){
    this.setState((prevState, props)=>{
      delete prevState.nounsBasic[nodeId]; // remove the node data froom obj
      prevState.nounsList = prevState.nounsList.filter((value, index)=>{ // use filter remove id from the list and replace it by new list
        //using filter is just a safer way to remove 'all candidate' (at the time it was add because there was a bug would push the same id more than once at 'add' part)
        return value != nodeId; //not equal value, but allow different "type" (the nodeId was string saved in the DOM attribute)
      }); 
      return prevState;
    }, ()=>{
      this.props._set_nouns({list: this.state.nounsList, basic: this.state.nounsBasic});
    })
  }

  render() {
    return (
      <div
        style={this.style.Com_Editing_NounsEditor__}>
        <div
          style={this.style.Com_Editing_NounsEditor_List}>
          <NounsList
            nounsList={this.state.nounsList}
            nounsBasic={this.state.nounsBasic}
            _set_nounDelete={this._set_nounDelete}/>
        </div>
        <div
          style={this.style.Com_Editing_NounsEditor_SearchModule}>
          <SearchModule
            _set_nodeChoice={this._set_nodeChoice}/>
        </div>
      </div>
    )
  }
}
