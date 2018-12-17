import React from 'React';
import ModalBox from '../ModalBox.jsx';
import {errHandler_axiosCatch} from '../../utils/errHandlers.js';

export class NounsList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_NounsEditor_List_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0',
        boxSizing: 'border-box',
        listStyle: 'none'
      },
      Com_NounsEditor_List_item: {
        width: '72%',
        height: '3vh',
        position: 'relative',
        boxSizing: 'border-box'
      }
    }
  }

  render() {
    const nouns = this.props.nounsList.map((nounId, index) => {
      return(
        <li
          key={'_key_nounList_item_'+index}
          style={this.style.Com_NounsEditor_List_item}>
          {this.props.nounsBasic[nounId].name}
        </li>
      )
    })

    return (
      <div
        style={this.style.Com_NounsEditor_List_}>
        {nouns}
      </div>
    )
  }
}

export class SearchModalNouns extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      query: null,
      optional: false,
      options: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_NounSet = this._axios_get_NounSet.bind(this);
    this._render_SearchResults = this._render_SearchResults.bind(this);
    this._handleClick_SearchModal_switch = this._handleClick_SearchModal_switch.bind(this);
    this._handleClick_nounChoose = this._handleClick_nounChoose.bind(this);
    this._handleClick_nounCreate = this._handleClick_nounCreate.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this.style={
      Com_NounsEditor_SearchModal_: {
        width: '100%',
        height: '5vh',
        position: 'relative'
      },
      Com_NounsEditor_SearchModal_anchor_still: {
        width: "80%",
        height: '70%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: '(-50%, 0)',
        boxSizing: 'border-box',
        border: '1px solid black',
        cursor: 'text'
      },
      Com_NounsEditor_SearchModal_anchor_active: {
        width: "80%",
        height: '80%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(180,180,180,0.6)'
      },
      Com_NounsEditor_SearchModal_Modal_:{
        width: '120%',
        minHeight: '200%',
        position: 'absolute',
        top: '50%',
        left: '-50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2%',
        boxShadow: '0px 5px 1.8vh -0.5vh #010101',
        backgroundColor: '#51514A',
        color: '#FAFAFA'
      },
      Com_NounsEditor_SearchModal_Modal_panel: {
        width: '80%',
        height: '4vh',
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
      },
      Com_NounsEditor_SearchModal_Modal_input: {
        width: '90%',
        height: '4vh',
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        padding: '1.2% 0',
        border: 'none',
        borderBottom: '2px inset #FAFAFA',
        backgroundColor: 'transparent',
        fontSize: '2.4vh',
        color: '#FAFAFA'
      },
      Com_InfoNoun_modal_ul_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '1%, 0',
        padding: '0 6%',
        listStyle: 'none'
      },
      Com_InfoNoun_modal_ul_li: {
        position: 'relative',
        boxSizing: 'border-box',
        margin: '12px 0',
        fontSize: '2.4vh'
      }
    }
  }

  _axios_get_NounSet(){
    const self = this;
    this.setState({axios: true});
    axios.get(`/router/lists/nouns/search?prefix=${this.state.query}&limit=5`, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then((res) => {
      self.setState({axios: false});
      let resObj = JSON.parse(res.data);
      if(resObj.main.nounsList.length > 0){
        this.setState({
          optional: true,
          options: resObj.main.nounsList
        });
      }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          return null;
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }

  _render_SearchResults(){
    let options = [];
    if(this.state.query){
      this.state.optional?(
        options = this.state.options.map((nounBasic, index) => {
          return(
            <li
              key={'_key_nounOption_'+index}
              index={index}
              style={this.style.Com_InfoNoun_modal_ul_li}
              onClick={this._handleClick_nounChoose}>
              {nounBasic.name}
            </li>
          )
        })
      ):(
        options = [<span key='_key_nounOption_none'>{'...尚無相關詞彙...'}</span>]
      )
    }else{
      options = [<span>{'請輸入欲查詢關聯詞...'}</span>]
    }
    return options;
  }

  _handleChange_SearchInput(){
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 0) {
        this._axios_get_NounSet()
      }
    })
  }

  _handleClick_nounChoose(event){
    event.stopPropagation();
    event.preventDefault();
    let nounBasic = Object.assign({}, this.state.options[event.currentTarget.getAttribute('index')]);
    this.props._set_nounChoose(nounBasic, true);
    this.search.value = ''
    this.setState({query: '', options:[]});
  }

  _handleClick_nounCreate(event){
    event.stopPropagation();
    event.preventDefault();
    let newName = ''+this.state.query;
    this.props._set_nounChoose({name: newName}, false);
    this.setState({query: '', options:[]});
    this.search.value = '';
  }

  _handleClick_SearchModal_switch(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, index)=>{return {query: prevState.query?null:true}});
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render() {
    const options = this._render_SearchResults();

    return (
      <div
        id='id_Com_NounsEditor_SearchModal_'
        style={this.style.Com_NounsEditor_SearchModal_}>
        <div
          style={this.state.query?this.style.Com_NounsEditor_SearchModal_anchor_still:this.style.Com_NounsEditor_SearchModal_anchor_active}
          onClick={this._handleClick_SearchModal_switch}>
          {!this.state.query && "add some nouns......"}
        </div>
        {
          this.state.query &&
          <ModalBox containerId="id_Com_NounsEditor_SearchModal_">
            <div
              style={this.style.Com_NounsEditor_SearchModal_Modal_}>
              <input
                ref={input => this.search = input}
                style={this.style.Com_NounsEditor_SearchModal_Modal_input}
                onChange={this._handleChange_SearchInput}/>
              <ul
                style={this.style.Com_InfoNoun_modal_ul_}>
                {options}
              </ul>
              <div
                style={this.style.Com_NounsEditor_SearchModal_Modal_panel}>
                {
                  this.state.query &&
                  <div>
                    <span>{'或'}</span>
                    <span
                      style={{backgroundColor: 'reba(230, 210, 210, 0.8)', cursor: 'pointer'}}
                      onClick={this._handleClick_nounCreate}>
                      {" 新增 "}</span>
                    <span>{this.state.query}</span>
                  </div>
                }
                <span
                  style={{cursor: 'pointer'}}
                  onClick={this._handleClick_SearchModal_switch}>
                  {" 完成"}</span>
              </div>
            </div>
          </ModalBox>
        }
      </div>
    )
  }
}
