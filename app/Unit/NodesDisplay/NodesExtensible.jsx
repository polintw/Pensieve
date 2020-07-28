import React from 'react';
import classnames from 'classnames';
import styles from "./styles.module.css";

export class NodesExtensible extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLiItem: ''
    };
    this._handleEnter_node = this._handleEnter_node.bind(this);
    this._handleLeave_node = this._handleLeave_node.bind(this);
    this._render_unitModal_Nouns =this._render_unitModal_Nouns.bind(this);
    this._handleClick_Node = this._handleClick_Node.bind(this);
  }

  _handleEnter_node(e){
    let currentItem = e.currentTarget.attributes.nodeId.value;
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
          className={classnames("colorEditBlack", "fontTitle")}
          style={{display: 'flex',alignItems:'center',marginRight: '1rem'}}>{"|"}</span>
      ); //end of "if"
      let nodeId = self.props.nouns.list[i];
      let iNoun = self.props.nouns.basic[nodeId];
      nounsArr.push(
        <li
          key={"key_unitModal_Nouns_"+i}
          nodeId={nodeId}
          className={classnames(styles.boxListItem)}
          onClick={this._handleClick_Node}
          onMouseEnter={this._handleEnter_node}
          onMouseLeave={this._handleLeave_node}>
          <span
            className={classnames(
              styles.spanNodeItem, "colorEditLightBlack",
              {
                ["fontTitle"]: (cssVW > 860),
                ["fontNodesEqual"]: (cssVW <=860),
                [styles.spanNodeItemMouse]: (this.state.onLiItem == nodeId && nodeId != 4692) // 4692 is an safe id in DB nouns table that do not represent anything, used to set for none node text, like 'Welcome ...'
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

  _handleClick_Node(event){
    event.preventDefault();
    event.stopPropagation();
    let currentNode = event.currentTarget.attributes.nodeId.value;
    if(currentNode == "4692") return ; // 4692 is an safe id in DB nouns table that do not represent anything, used to set for none node text, like 'Welcome ...'
    this.props._referNode("noun", currentNode);
  }
}
