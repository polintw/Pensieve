import React from 'React';
import RefEditing from './RefEditing.jsx';

export default class RefBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_RefBlock_new = this._handleClick_RefBlock_new.bind(this);
    this._handleClick_Ref_inBlock = this._handleClick_Ref_inBlock.bind(this);
    this._handleClick_RefBlock_expand = this._handleClick_RefBlock_expand.bind(this);
    this.style={
      div_refBlock_new: {
        width: '16%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: "5%",
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        border: '1px #FAFAFA',
        borderStyle: 'dotted dotted dotted none',
        cursor: 'pointer'
      },
      div_refBlock_exist_list: {
        width: '75%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '25%',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box'
      },
      div_refBlock_exist: {
        display: 'inline-block',
        width: '42%',
        height: '100%',
        boxSizing: 'border-box',
        margin: '0 3% 0 0',
        backgroundColor: '#FAFAFA',
        verticalAlign: 'top',
        cursor: 'pointer'
      },
      div_refBlock_checkAll: {
        display: 'inline-block',
        width: '5%',
        height: '100%',
        boxSizing: 'border-box',
        border: '1px #FAFAFA',
        borderStyle: 'solid none solid solid',
        writingMode: 'vertical-rl',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_RefBlock_new(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_focusBlock("ref");
    this.props._set_focusBlockify(true);
  }

  _handleClick_Ref_inBlock(event){
    event.preventDefault();
    event.stopPropagation();
    window.open(event.currentTarget.attributes.refdata.webLink, '_blank');
  }

  _handleClick_RefBlock_expand(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_focusBlock("ref");
    this.props._set_focusBlockify(true);
  }

  render(){
    const self =this;
    let refsInBlock = this.props.refsArr.map(function(obj, index){
      return(
        <div
          key={'key_refsInBlock_'+index}
          style={self.style.div_refBlock_exist}
          redata={obj}
          onClick={self._handleClick_Ref_inBlock}>
          {obj.title}
        </div>
      )
    })
    return(
      <div
        style={this.props.componentStyle}>
        <div
          style={this.style.div_refBlock_new}
          onClick={this._handleClick_RefBlock_new}>
        </div>
        <div
          style={this.style.div_refBlock_exist_list}>
          {refsInBlock}
          <div
            style={this.style.div_refBlock_checkAll}
            onClick={this._handleClick_RefBlock_expand}>
            {"查看全部"}
          </div>
        </div>
      </div>
    )
  }
}
