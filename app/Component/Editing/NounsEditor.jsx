import React from 'react';
import {NounsList, SearchModule} from './NounsEditorCom.jsx';

export default class NounsEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nounsList: this.props.nouns.list,
      nounsBasic: this.props.nouns.basic
    };
    this._set_nounChoose = this._set_nounChoose.bind(this);
    this._set_nounDelete = this._set_nounDelete.bind(this);
    this.style={
      Com_Editing_NounsEditor__: {
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_Editing_NounsEditor_List: {
        width: '100%',
        position: 'relative',
        backgroundColor: 'rgba(180,180,180,0.6)'
      },
      Com_Editing_NounsEditor_SearchModule: {
        width: '80%',
        height: '3rem',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _set_nounChoose(nounBasic){
    let nounObj = Object.assign({}, nounBasic);
    this.setState((prevState, props)=>{
      prevState.nounsList.push(nounObj.id);
      prevState.nounsBasic[nounObj.id] = nounObj;
      return prevState;
    }, ()=>{
      this.props._set_nouns({list: this.state.nounsList, basic: this.state.nounsBasic});
    })
  }

  _set_nounDelete(nounIndex){
    this.setState((prevState, props)=>{
      const nounId = prevState.nounsList[nounIndex];
      delete prevState.nounsBasic[nounId];
      prevState.nounsList.splice(nounIndex, 1);
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
            _set_nounChoose={this._set_nounChoose}/>
        </div>
      </div>
    )
  }
}
