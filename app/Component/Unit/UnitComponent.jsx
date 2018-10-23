import React from 'react';
import cxBind from 'classnames/bind';
import SvgPropic from '../SvgPropic.jsx';

export class NounsExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_listNoun = this._handleClick_listNoun.bind(this);
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
        boxSizing: 'border-box',
        fontSize: '2rem',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'cwTeXMing',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_listNoun(event){
    event.preventDefault();
    event.stopPropagation();
    let id = event.currentTarget.getAttribute('nounid');
    this.props._handleClick_listNoun('noun', id);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_Nouns_Extensible_}>
        <ul
          style={this.style.Com_Nouns_Extensible_list_}>
          <li
            nounid={this.props.nouns.basic[this.props.nouns.list[0]].id}
            style={this.style.Com_Nouns_Extensible_list_item_}
            onClick={this._handleClick_listNoun}>
            {this.props.nouns.basic[this.props.nouns.list[0]].name}
          </li>
        </ul>
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
