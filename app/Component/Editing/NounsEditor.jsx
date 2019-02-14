import React from 'React';
import {NounsList, SearchModalNouns} from './NounsEditorCom.jsx';

export default class NounsEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nounsList: this.props.nouns.list,
      nounsBasic: this.props.nouns.basic
    };
    this._set_nounChoose = this._set_nounChoose.bind(this);
    this.style={
      Com_Editing_NounsEditor__: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Com_Editing_NounsEditor_List: {
        width: '100%',
        position: 'relative',
        backgroundColor: 'rgba(180,180,180,0.6)'
      },
      Com_Editing_NounsEditor_SearchModel: {
        width: '100%',
        height: '5vh',
        position: 'relative',
        backgroundColor: 'rgba(180,180,180,0.6)'
      }
    }
  }

  _set_nounChoose(nounBasic, ify){
    if(ify){
      let nounObj = Object.assign({ify: true}, nounBasic);
      this.setState((prevState, props)=>{
        prevState.nounsList.push(nounObj.id);
        prevState.nounsBasic[nounObj.id] = nounObj;
        this.props._set_nouns({list: prevState.nounsList, basic: prevState.nounsBasic});
        return prevState;
      })
    }else{
      let nounObj = Object.assign({ify: false}, nounBasic);
      this.setState((prevState, props)=>{
        const tempId = "nounsEditor_tempNouns_"+prevState.nounsList.length;
        prevState.nounsList.push(tempId);
        prevState.nounsBasic[tempId] = Object.assign({id:tempId}, nounObj);
        this.props._set_nouns({list: prevState.nounsList, basic: prevState.nounsBasic});
        return prevState;
      })
    }
  }

  render() {
    return (
      <div
        style={this.style.Com_Editing_NounsEditor__}>
        <div
          style={this.style.Com_Editing_NounsEditor_List}>
          <NounsList
            nounsList={this.state.nounsList}
            nounsBasic={this.state.nounsBasic}/>
        </div>
        <div
          style={this.style.Com_Editing_NounsEditor_SearchModel}>
          <SearchModalNouns
            _set_nounChoose={this._set_nounChoose}/>
        </div>
      </div>
    )
  }
}
