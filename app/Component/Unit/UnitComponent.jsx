import React from 'react';
import cxBind from 'classnames/bind';
import SvgPropic from '../SvgPropic.jsx';

export class NounsExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false
    };
    this._handleClick_listNoun = this._handleClick_listNoun.bind(this);
    this._handleClick_listExpand = this._handleClick_listExpand.bind(this);
    this._render_unitModal_Nouns =this._render_unitModal_Nouns.bind(this);
    this.style={
      Com_Nouns_Extensible_: {
        width: '100%',
        position: 'relative',
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
        fontSize: '1.6rem',
        letterSpacing: '0.6vh',
        fontWeight: '400',
        fontFamily: 'cwTeXMing',
        color: '#FAFAFA',
        cursor: 'pointer'
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
          style={self.style.Com_Nouns_Extensible_list_item_}
          onClick={self._handleClick_listNoun}>
          <span
            title={iNoun.name+ (iNoun.prefix ? ", "+iNoun.prefix:"")}>
            {iNoun.name}
          </span>
        </li>
      )
    }

    return nounsArr;
  }

  _handleClick_listNoun(event){
    event.preventDefault();
    event.stopPropagation();
    let id = event.currentTarget.getAttribute('nounid');
    this.props._handleClick_listNoun('noun', id);
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
            this.props.nouns.length>2 ? 'show all >' : null
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
    this._render_monthRome = this._render_monthRome.bind(this);
    this.style={
      Com_DateConverter_: {
        fontSize: '1.4rem',
        letterSpacing: '0.15rem',
        textAlign: 'center',
        fontWeight: '400'
      }
    }
  }

  _render_monthRome(date){
    switch (date.getMonth()) {
      case 0:
        return "Jan"
        break;
      case 1:
        return "Feb"
        break;
      case 2:
        return "Mar"
        break;
      case 3:
        return "Apr"
        break;
      case 4:
        return "May"
        break;
      case 5:
        return "Jun"
        break;
      case 6:
        return "Jul"
        break;
      case 7:
        return "Aug"
        break;
      case 8:
        return "Sep"
        break;
      case 9:
        return "Oct"
        break;
      case 10:
        return "Nov"
        break;
      case 11:
        return "Dec"
        break;
      default:
        return date.getMonth()
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let d = new Date(this.props.datetime)

    return(
      <div
        style={this.style.Com_DateConverter_}>
        <span>{d.getDate()}</span>
        <span>{". "}</span>
        <span>{this._render_monthRome(d)}</span>
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
      },
      Com_Author_full_propic_: {
        display: 'inline-block',
        width: '27%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
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
        <div style={this.style.Com_Author_full_propic_}>
          <SvgPropic/>
        </div>
        <span style={this.style.Com_Author_full_text_}>
          {this.props.authorBasic.account}
        </span>
      </div>
    )
  }
}
/*
export class  extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionControl_}>

      </div>
    )
  }
}
*/
