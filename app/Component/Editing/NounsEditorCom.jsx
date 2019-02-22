import React from 'react';
import ModalBox from '../ModalBox.jsx';
import {errHandler_axiosCatch} from '../../utils/errHandlers.js';

export class NounsList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nounDelete = this._handleClick_nounDelete.bind(this);
    this.style={
      Com_NounsEditor_List_: {
        width: '100%',
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

  _handleClick_nounDelete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_nounDelete(event.currentTarget.getAttribute('index'));
  }

  render() {
    const nouns = this.props.nounsList.map((nounId, index) => {
      let thisNoun = this.props.nounsBasic[nounId];
      return(
        <li
          key={'_key_nounList_item_'+index}
          style={this.style.Com_NounsEditor_List_item}>
          <span>{thisNoun.name}</span>
          <span style={{fontStyle: 'italic', color:'#F1F1F1'}}>{thisNoun.prefix ? ", "+thisNoun.prefix :""}</span>
          <span
            index={index}
            style={{float: 'right', color:'#F1F1F1', cursor: 'pointer'}}
            onClick={this._handleClick_nounDelete}>
            {"x"}</span>
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

export class SearchModule extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false
    };
    this._set_SearchModal_switch = this._set_SearchModal_switch.bind(this);
    this._handleClick_SearchModal_switch = this._handleClick_SearchModal_switch.bind(this);
    this.style={
      Com_NounsEditor_SearchModal_: {
        width: '100%',
        height: '100%',
        position: 'absolute'
      },
      Com_NounsEditor_SearchModal_anchor: {
        width: "80%",
        height: '80%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(180,180,180,0.6)',
        cursor: 'text'
      },
    }
  }

  _set_SearchModal_switch(){
    this.setState((prevState, index)=>{
      return {expandify: prevState.expandify?false:true}
    });
  }
  _handleClick_SearchModal_switch(event){
    event.stopPropagation();
    event.preventDefault();
    this._set_SearchModal_switch();
  }

  render() {
    return (
      <div
        style={this.style.Com_NounsEditor_SearchModal_}>
        {
          this.state.expandify ?(
            <NounsSearchModal
              _set_nounChoose={this.props._set_nounChoose}
              _set_SearchModal_switch={this._set_SearchModal_switch}
              _handleClick_SearchModal_switch={this._handleClick_SearchModal_switch}/>
          ):(
            <div
              style={this.style.Com_NounsEditor_SearchModal_anchor}
              onClick={this._handleClick_SearchModal_switch}>
              {"Find a place related......"}
            </div>
          )
        }
      </div>
    )
  }
}

class NounsSearchModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      query: "",
      optional: false,
      options: []
    };
    this.search = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_NounSet = this._axios_get_NounSet.bind(this);
    this._render_SearchResults = this._render_SearchResults.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this._handleClick_nounChoose = this._handleClick_nounChoose.bind(this);
    this.style={
      Com_NounsEditor_SearchModal_Modal_:{
        width: '100%',
        minHeight: '200%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2%',
        boxShadow: '0px 5px 1.8vh -0.5vh #010101',
        backgroundColor: 'rgba(180,180,180,0.6)',
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
      Com_NounsEditor_SearchModal_Modal_panel_:{
        width: '100%',
        height: '4vh',
        position: 'relative',
        left: '0%',
        boxSizing: 'border-box',
        padding: '1.2% 0'
      },
      Com_NounsEditor_SearchModal_Modal_panel_input: {
        width: '80%',
        height: '90%',
        position: 'relative',
        boxSizing: 'border-box',
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
        fontSize: '2.4vh',
        cursor: 'pointer'
      }
    }
  }

  _axios_get_NounSet(){
    const self = this;
    this.setState({axios: true});
    axios.get(`/router/nouns/search/simple?aquired=${this.state.query}&limit=5`, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
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
              <span>{nounBasic.name}</span>
              <span>{nounBasic.prefix? (", "+nounBasic.prefix):("")}</span>
            </li>
          )
        })
      ):(
        options = [<span key='_key_nounOption_none'>{'......'}</span>]
      )
    }else{
      options = [<span>{'perhaps a name of a city or district...'}</span>]
    }
    return options;
  }

  _handleChange_SearchInput(){
    this.setState({
      query: this.search.current.value
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
    this.props._set_nounChoose(nounBasic);
    this.setState({
      query: "",
      optional: false,
      options: []
    }, ()=>{
      this.search.current.focus();
    })
  }

  componentDidMount(){
    this.search.current.focus();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const options = this._render_SearchResults();

    return(
      <div
        style={this.style.Com_NounsEditor_SearchModal_Modal_}>
        <div
          style={this.style.Com_NounsEditor_SearchModal_Modal_panel_}>
          <input
            ref={this.search}
            value={this.state.query}
            style={this.style.Com_NounsEditor_SearchModal_Modal_panel_input}
            onChange={this._handleChange_SearchInput} />
          <div
            style={{ display:'inline-block',cursor: 'pointer' }}
            onClick={this.props._handleClick_SearchModal_switch}>
            {"close"}
          </div>
        </div>
        <ul
          style={this.style.Com_InfoNoun_modal_ul_}>
          {options}
        </ul>
      </div>
    )
  }
}
