import React from 'react';
import classnames from 'classnames';
import styles from "./styles.module.css";

export class NodesExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false,
      onLiItem: ''
    };
    this._handleEnter_node = this._handleEnter_node.bind(this);
    this._handleLeave_node = this._handleLeave_node.bind(this);
    this._handleClick_listNoun = this._handleClick_listNoun.bind(this);
    this._handleClick_listExpand = this._handleClick_listExpand.bind(this);
    this._render_unitModal_Nouns =this._render_unitModal_Nouns.bind(this);
    this.style={
      Com_Nodes_Extensible_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      },
      Com_Nodes_Extensible_list_: {
        width: '100%',
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        listStyle: 'none'
      },
      Com_Nodes_Extensible_switch_: {
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

  _handleEnter_node(e){
    let currentItem = e.currentTarget.attributes.nounid.value;
    this.setState({onLiItem: currentItem})
  }

  _handleLeave_node(e){
    this.setState({onLiItem: ''})
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
          className={classnames(styles.boxListItem)}
          style={Object.assign({},this.props.styleItem)}
          onMouseEnter={this._handleEnter_node}
          onMouseLeave={this._handleLeave_node}
          onClick={self._handleClick_listNoun}>
          <div
            className={classnames(
              styles.boxItemWrap,
              {[styles.interLiItem]: (this.state.onLiItem==nounId)}
            )}
            title={iNoun.name+ (iNoun.prefix ? ", "+iNoun.prefix:"")}>
            {
              (this.state.onLiItem==nounId) &&
              <span style={{
                  width: '84%', position: 'absolute', bottom: '-5%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {iNoun.name}
          </div>
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
    return(
      <div
        style={this.style.Com_Nodes_Extensible_}>
        <ul
          style={this.style.Com_Nodes_Extensible_list_}>
          {this._render_unitModal_Nouns()}
        </ul>
        {
          (this.props.nouns.length>2) &&
          <div
            style={this.style.Com_Nodes_Extensible_switch_}
            onClick={this._handleClick_listExpand}>
             'show all >'
          </div>
        }
      </div>
    )
  }
}
