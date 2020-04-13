import React from 'react';
import {errHandler_axiosCatch} from '../../utils/errHandlers.js';
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from './stylesFont.module.css';

const styleMiddle={
  spanPlaceholder: {
    fontSize: '1.3rem',
    letterSpacing: '0.03rem',
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

const stylesShareSearch = {
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
  Com_NounsEditor_SearchModal_Modal_close_span: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'right',
    cursor: 'pointer'
  },
}

const stylesBelongSearch = {
  comNodeSearchModule:{
    width: '100%',
    boxSizing: 'border-box',
  },
  boxSearchInput:{
    width: '37.5%',
    position: 'absolute',
    top: '4.7rem',
    left: '6.25%',
    boxSizing: 'border-box',
    borderBottom: '1px solid #6e6e6e',
    padding: '0 2% 0.5rem'
  },
  inputSearchInput: {
    display: 'inline-block',
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent', //this is for ovelapping the default set of tag 'input'
    font: 'inherit' //the position of this one is important, must above all other 'font' properties
  },
  fontInput:{
    fontSize: '1.76rem',
    letterSpacing: '0.04rem',
    fontWeight: '400',
    color: '#000000'
  },
  boxClose: {
    position: 'absolute',
    top: '8.7rem',
    left: '36.5%',
    boxSizing: 'border-box',
    transform: 'translate(-50%,0%)'
  },
  spanClose: {
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  fontClose: {
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.03rem',
    color: '#a8a8a8'
  },
  ulCandidates: {
    width: '50%',
    maxHeight: '17rem',
    minHeight: '8rem',
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    padding: '3%',
    margin: '0',
    overflow: 'auto',
    listStyle: 'none'
  },
  liItem: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '1.2rem 0',
    padding: '2% 2%',
    borderRadius: '0.6rem',
    cursor: 'pointer'
  }
}

const DOMInput = (comp)=> {
  return (
    <div
      className={styles.comNodeModuleInputDir}>
      <div
        className={classnames(
          styles.boxInput,
          stylesFont.fontListItem,
          stylesFont.colorListItem,
          {[styles.boxInputFocus]: comp.state.focused}
        )}>
        <input
          ref={comp.search}
          value={comp.state.query}
          onFocus={()=> comp.setState((prevState, props)=>{return {focused: true};})}
          onBlur={()=> comp.setState((prevState, props)=>{return {focused: false};})}
          onKeyDown={comp._handleKeyDown_onInput}
          onChange={comp._handleChange_SearchInput} />
      </div>
      {
        comp.state.query &&
        <ul
          className={classnames(
            styles.boxList,
            {[styles.boxListReversed]: comp.props.reversed}
          )}>
          {comp._render_SearchResults()}
        </ul>
      }
    </div>
  )
}

const DOMBelongSearch = (comp)=> {
  return (
    <div
      style={stylesBelongSearch.comNodeSearchModule}>
      <div
        style={stylesBelongSearch.boxSearchInput}>
        <input
          ref={comp.search}
          value={comp.state.query}
          style={Object.assign({}, stylesBelongSearch.inputSearchInput, stylesBelongSearch.fontInput)}
          onChange={comp._handleChange_SearchInput} />
      </div>
      <div
        style={stylesBelongSearch.boxClose}
        onClick={comp.props._handleClick_SearchModal_switch}>
        <span
          style={Object.assign({}, stylesBelongSearch.spanClose, stylesBelongSearch.fontClose)}>
          {'close'}
        </span>
      </div>
      <ul
        style={Object.assign({}, stylesBelongSearch.ulCandidates, stylesBelongSearch.fontInput)}>
        {comp._render_SearchResults()}
      </ul>
    </div>
  )
}

const DOMSearchResult = (comp, nounBasic, index)=>{
  return(
    <li
      key={'_key_nounOption_'+index}
      index={index}
      className={classnames(
        stylesFont.fontListItem,
        stylesFont.colorListItem,
        {[styles.boxLiFilled]: (comp.state.onLiItem == index)}
      )}
      onClick={comp._handleClick_nounChoose}
      onMouseEnter={comp._handleEnter_liItem}
      onMouseLeave={comp._handleLeave_liItem}>
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
      style={Object.assign({}, stylesBelongSearch.liItem, {borderBottom: (comp.state.onLiItem==index)? 'solid 1px #ff7a5f': 'solid 1px rgb(110, 110, 110)'})}
      onClick={comp._handleClick_nounChoose}
      onMouseEnter={comp._handleEnter_liItem}
      onMouseLeave={comp._handleLeave_liItem}>
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
      focused: false,
      query: "",
      optional: false,
      options: [],
      onLiItem: '-1' //it;s quite weired but, if we set 'false' here, the comparison we used inside the DOM would get 'equal' whem the value at right side is '0'
    };
    this.search = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_NounSet = this._axios_get_NounSet.bind(this);
    this._render_SearchResults = this._render_SearchResults.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this._handleClick_nounChoose = this._handleClick_nounChoose.bind(this);
    this._handleKeyDown_onInput = this._handleKeyDown_onInput.bind(this);
  }

  _handleEnter_liItem(e){
    this.setState({
      onLiItem: e.currentTarget.getAttribute('index')
    })
  }

  _handleLeave_liItem(e){
    this.setState({
      onLiItem: '-1'
    })
  }

  _handleKeyDown_onInput(event){
    if(!this.state.optional) return; // no options could be selected, no need to handle

    switch (event.keyCode || event.which) {
      case 38: // key 'up' 
        if (this.state.onLiItem != '-1' && this.state.onLiItem != '0'){ //already focus in the list, But! not the top one
          //onLiItem represent the index to state.options
          this.setState((prevState, props)=>{
            let itemIndex = Number(prevState.onLiItem); //attribute was always keep in string, have to parsed
            itemIndex = itemIndex - 1;
            return {
              onLiItem: itemIndex.toString()
            }
          })
        }
        else if(this.state.onLiItem == '-1'){ //not focus on the list, but has option(s)
          this.setState((prevState, props) => {
            return {
              onLiItem: '0'
            }
          })
        }

        break;
      case 40: // key 'down' 
        if (this.state.onLiItem != '-1' && Number(this.state.onLiItem) < this.state.options.length) { //already focus in the list, But! not the last one
          //onLiItem represent the index to state.options
          this.setState((prevState, props) => {
            let itemIndex = Number(prevState.onLiItem); //attribute was always keep in string, have to parsed
            itemIndex = itemIndex + 1;
            return {
              onLiItem: itemIndex.toString()
            }
          })
        }
        else if (this.state.onLiItem == '-1') { //not focus on the list, but has option(s)
          this.setState((prevState, props) => {
            return {
              onLiItem: '0'
            }
          })
        }

        break;
      case 27: // key 'Esc' 
        this.setState({
          query: "",
          optional: false,
          options: [],
          onLiItem: '-1'
        })
        break;    
      case 13: // key 'Enter' 
        if(this.state.onLiItem != '-1'){ //make sure there was really an selected one
          let nounBasic = Object.assign({}, this.state.options[Number(this.state.onLiItem)]);
          this.props._set_nodeChoice(nounBasic);
          this.setState({
            query: "",
            optional: false,
            options: [],
            onLiItem: '-1'
          })
        }
        break;    
      default:
        break;
    }
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
      options: [],
      onLiItem: '-1'
    }, ()=>{
      this.props._set_SearchModal_switch()
    })
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
      let nodesList = resObj.main.nounsList;
      if (!!this.props.reversed) nodesList = nodesList.reverse();

      this.setState({
        optional: nodesList.length > 0?true:false,
        options: nodesList
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
            case "option":
              return DOMResultBelong(this, nounBasic, index)
              break;
            case "inputDirect":
              return DOMSearchResult(this, nounBasic, index)
              break;
            default:
              return DOMResultBelong(this, nounBasic, index)
          }
        })
      ):(
        options = [
          <span
            key='_key_nounOption_none'
            className={classnames(
              stylesFont.fontListItem,
              stylesFont.colorListItem
            )}>
            {'......'}</span>
        ]
      );
    }else{
      options = [(
        <span
          key='_key_nounOption_placeholder'
          style={Object.assign({},
            {display: 'inline-block', textAlign: 'right', margin:'1rem 0'},
            styleMiddle.spanPlaceholder)}>
            {'perhaps a name of a city or district...'}</span>
      )]
    }
    return options;
  }

  componentDidMount(){
    if(this.props.mountFocus) this.search.current.focus();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    switch (this.props.type) {
      case "option":
        return DOMBelongSearch(this)
        break;
      case "inputDirect":
        return DOMInput(this)
        break;
      default:
        return DOMInput(this)
    }
  }
}
