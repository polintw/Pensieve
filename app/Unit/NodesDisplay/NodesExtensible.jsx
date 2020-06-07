import React from 'react';
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';

export class NodesExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLiItem: ''
    };
    this._handleEnter_node = this._handleEnter_node.bind(this);
    this._handleLeave_node = this._handleLeave_node.bind(this);
    this._render_unitModal_Nouns =this._render_unitModal_Nouns.bind(this);
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
    let expandLeng = 3;
    let cssVW = window.innerWidth; // for RWD
    for(let i = 0; i < expandLeng ; i++){
      // display only the nodes under limit
      if(i >= this.props.nouns.list.length) break;
      // insert "|" between
      if(i != 0) nounsArr.push(
        <span
          className={classnames(stylesFont.colorEditBlack, stylesFont.fontTitle)}
          style={{display: 'flex',alignItems:'center',marginRight: '1rem'}}>{"|"}</span>
      ); //end of "if"
      let nounId = self.props.nouns.list[i];
      let iNoun = self.props.nouns.basic[nounId];
      nounsArr.push(
        <li
          key={"key_unitModal_Nouns_"+i}
          nounid={nounId}
          className={classnames(styles.boxListItem)}
          onMouseEnter={this._handleEnter_node}
          onMouseLeave={this._handleLeave_node}>
          <span
            className={classnames(
              styles.spanNodeItem,
              stylesFont.colorEditLightBlack,
              {
                [stylesFont.fontTitle]: (cssVW > 860),
                ["fontNodesEqual"]: (cssVW <=860)
              }
             )}
            title={iNoun.name+ (iNoun.prefix ? ", "+iNoun.prefix:"")}>
            {iNoun.name}
          </span>
        </li>
      )
    }

    return nounsArr;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNodesExtensible)}>
        {this._render_unitModal_Nouns()}
      </div>
    )
  }
}
