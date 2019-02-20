import React from 'react';
import cxBind from 'classnames/bind';

export class NounsExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false
    };
    this._handleClick_listExpand = this._handleClick_listExpand.bind(this);
    this._render_unitModal_Nouns =this._render_unitModal_Nouns.bind(this);
    this.style={
      Com_Nouns_Extensible_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Nouns_Extensible_list_: {
        width: '100%',
        margin: '0',
        padding: '0',
        listStyle: 'none'
      },
      Com_Nouns_Extensible_list_item_: {
        display: 'inline-block',
        width: '100%',
        height: '2.2rem',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: '2rem',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'cwTeXMing',
        color: '#FAFAFA'
      },
      Com_Nouns_Extensible_switch_: {
        display: 'inline-block',
        width: '100%',
        height: '2rem',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        letterSpacing: '0.4vh',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'cwTeXMing',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _render_unitModal_Nouns(){
    const self = this;
    let nounsArr = [];
    let expandLeng = this.state.expandify?this.props.nouns.list.length:3
    for(let i = 0; i < expandLeng ; i++){
      if(i >= this.props.nouns.list.length) break;
      let nounId = self.props.nouns.list[i];
      let iNoun = self.props.nouns.basic[nounId];
      nounsArr.push(
        <li
          key={"key_unitModal_Nouns_"+i}
          nounid={nounId}
          style={self.style.Com_Nouns_Extensible_list_item_}>
          <span
            title={iNoun.name+ (iNoun.prefix ? ", "+iNoun.prefix:"")}>
            {iNoun.name}
          </span>
        </li>
      )
    }

    return nounsArr;
  }

  _handleClick_listExpand(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{
      return {expandify: prevState.expandify ? false : true}
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_Nouns_Extensible_}>
        <ul
          style={this.style.Com_Nouns_Extensible_list_}>
          {this._render_unitModal_Nouns()}
        </ul>
        <div
          style={this.style.Com_Nouns_Extensible_switch_}
          onClick={this._handleClick_listExpand}>
          {
            this.props.nouns.length>2 ? '展開全部 >' : null
          }
        </div>
      </div>
    )
  }
}


export class DateConverter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let d = new Date(this.props.datetime)

    return(
      <div
        style={this.style.Com_DateConverter_}>
        <span>{d.getMonth()+1}</span>
        <span> 月</span>
        <span>{d.getDate()}</span>
        <span>{" 日"}</span>
      </div>
    )
  }
}

export class AuthorFull extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Author = this._handleClick_Author.bind(this);
    this.style={
      Com_Author_full_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Author_full_text_: {
        display: 'inline-block',
        width: '73%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '10%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.2vh',
        fontWeight: '400',
        color: '#FAFAFA'
      }
    }
  }

  _handleClick_Author(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_Author('user', this.props.authorBasic.authorId);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_Author_full_}
        onClick={this._handleClick_Author}>
        <span style={this.style.Com_Author_full_text_}>
          {this.props.authorBasic.account}
        </span>
      </div>
    )
  }
}
