import React from 'react';
import ModalBox from './ModalBox.jsx';
import {errHandler_axiosCatch} from '../utils/errHandlers.js';

const styleMiddle={
  spanPlaceholder: {
    fontSize: '1.2rem',
    letterSpacing: '0.1rem',
    fontWeight: '400',
    color: '#ababab'
  },
  spanContent: {
    fontSize: '1.47rem',
    letterSpacing: '0.13rem',
    fontWeight: '300',
    fontFamily: "'gill-sans-nova', 'Noto Sans TC','Lato', sans-serif",
    color: '#FAFAFA'
  },
  spanSubmit: {
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.14rem',
    color: '#ededed'
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
        position: 'absolute',
      },
      Com_NounsEditor_SearchModal_anchor: {
        width: "92%",
        height: '81%',
        position: 'absolute',
        bottom: '7px', //in order to let the border bottom at same level as input in NodeSearchModule
        boxSizing: 'border-box',
        borderBottom: 'solid 0.2rem #e6e6e6',
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
            <NodeSearchModule
              _set_nodeChoice={this.props._set_nodeChoice}
              _set_SearchModal_switch={this._set_SearchModal_switch}
              _handleClick_SearchModal_switch={this._handleClick_SearchModal_switch}/>
          ):(
            <div
              style={Object.assign({}, this.style.Com_NounsEditor_SearchModal_anchor, styleMiddle.spanPlaceholder)}
              onClick={this._handleClick_SearchModal_switch}>
              {"Name it to a place......"}
            </div>
          )
        }
      </div>
    )
  }
}

const stylesShareSearch = {
  Com_NounsEditor_SearchModal_Modal_:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    boxSizing: 'border-box',
    overflow: 'visible'
  },
  Com_NounsEditor_SearchModal_Modal_panel_:{
    width: '88%',
    height: '98%',
    position: 'absolute',
    bottom: '7px',
    left: '6%',
    boxSizing: 'border-box',
    borderBottom: 'solid 0.2rem #e6e6e6',
  },
  Com_NounsEditor_SearchModal_Modal_close_: {
    width: '100%',
    height: '178%',
    position: 'absolute',
    bottom: '6%',
    right: '0%',
    boxSizing: 'border-box',
    padding: '0 4%',
    boxShadow: 'rgb(1, 1, 1) 0px 2px 0.4rem 0',
    backgroundColor: '#000000',
  },
  Com_NounsEditor_SearchModal_Modal_panel_input: {
    display: 'inline-block',
    width: '100%',
    height: '96%',
    position: 'relative',
    boxSizing: 'border-box',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    font: 'inherit' //the position of this one is important, must above all other 'font' properties
  },
  Com_NounsEditor_SearchModal_Modal_close_span: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'right',
    cursor: 'pointer'
  },
  Com_InfoNoun_modal_ul_: {
    width: '100%',
    maxHeight: '560%',
    position: 'absolute',
    bottom: '184%',
    right: '0',
    boxSizing: 'border-box',
    padding: '4% 4% 5%',
    margin: '0',
    boxShadow: 'rgb(1, 1, 1) 0px 3px 0.4rem 0',
    backgroundColor: '#000000',
    borderTopLeftRadius: '0.47vw',
    borderTopRightRadius: '0.47vw',
    overflow: 'auto',
    listStyle: 'none'
  },
  Com_InfoNoun_modal_ul_li: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '1.2rem 0',
    padding: '2% 2%',
    border: 'solid 1px #ededed',
    borderRadius: '0.6rem',
    cursor: 'pointer'
  }
}

const DOMShareSearch = (comp)=>{
  return (
    <div
      style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_}>
      <div
        style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_close_}
        onClick={comp.props._handleClick_SearchModal_switch}>
        <span
          style={Object.assign({}, stylesShareSearch.Com_NounsEditor_SearchModal_Modal_close_span, styleMiddle.spanSubmit)}>
          {'close'}
        </span>
      </div>
      <ul
        style={Object.assign({}, stylesShareSearch.Com_InfoNoun_modal_ul_, styleMiddle.spanContent)}>
        {comp._render_SearchResults()}
      </ul>
      <div
        style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_panel_}>
        <input
          ref={comp.search}
          value={comp.state.query}
          style={Object.assign({}, stylesShareSearch.Com_NounsEditor_SearchModal_Modal_panel_input, styleMiddle.spanContent)}
          onChange={comp._handleChange_SearchInput} />
      </div>
    </div>
  )
}

const DOMBelongSearch = (comp)=> {
  return (
    <div
      style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_}>
      <div
        style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_close_}
        onClick={comp.props._handleClick_SearchModal_switch}>
        <span
          style={Object.assign({}, stylesShareSearch.Com_NounsEditor_SearchModal_Modal_close_span, styleMiddle.spanSubmit)}>
          {'close'}
        </span>
      </div>
      <ul
        style={Object.assign({}, stylesShareSearch.Com_InfoNoun_modal_ul_, styleMiddle.spanContent)}>
        {comp._render_SearchResults()}
      </ul>
      <div
        style={stylesShareSearch.Com_NounsEditor_SearchModal_Modal_panel_}>
        <input
          ref={comp.search}
          value={comp.state.query}
          style={Object.assign({}, stylesShareSearch.Com_NounsEditor_SearchModal_Modal_panel_input, styleMiddle.spanContent)}
          onChange={comp._handleChange_SearchInput} />
      </div>
    </div>
  )
}

const DOMResultShare = (comp, nounBasic, index)=>{
  return(
    <li
      key={'_key_nounOption_'+index}
      index={index}
      style={stylesShareSearch.Com_InfoNoun_modal_ul_li}
      onClick={comp._handleClick_nounChoose}>
      <span>{nounBasic.name}</span>
      <span>{nounBasic.prefix? (", "+nounBasic.prefix):("")}</span>
    </li>
  )

}

const DOMResultBelong = (comp, nounBasic, index)=>{
  return(
    <li
      key={'_key_nounOption_'+index}
      index={index}
      style={stylesShareSearch.Com_InfoNoun_modal_ul_li}
      onClick={comp._handleClick_nounChoose}>
      <span>{nounBasic.name}</span>
      <span>{nounBasic.prefix? (", "+nounBasic.prefix):("")}</span>
    </li>
  )

}

export class NodeSearchModule extends React.Component {
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
      this.setState({
        optional: resObj.main.nounsList.length > 0?true:false,
        options: resObj.main.nounsList
      });
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
          switch (this.props.type) {
            case "share":
              return DOMResultShare(this, nounBasic, index)
              break;
            case "belong":
              return DOMResultBelong(this, nounBasic, index)
              break;
            default:
              return DOMResultShare(this, nounBasic, index)
          }
        })
      ):(
        options = [<span key='_key_nounOption_none' style={styleMiddle.spanPlaceholder}>{'......'}</span>]
      )
    }else{
      options = [(
        <span
          key='_key_nounOption_placeholder'
          style={Object.assign({}, {display: 'inline-block', textAlign: 'right'}, styleMiddle.spanPlaceholder)}>{'perhaps a name of a city or district...'}</span>
      )]
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
    this.props._set_nodeChoice(nounBasic);
    this.setState({
      query: "",
      optional: false,
      options: []
    }, ()=>{
      this.props._set_SearchModal_switch()
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
    switch (this.props.type) {
      case "share":
        return DOMShareSearch(this)
        break;
      case "belong":
        return DOMBelongSearch(this)
        break;
      default:
        return DOMShareSearch(this)
    }
  }
}
