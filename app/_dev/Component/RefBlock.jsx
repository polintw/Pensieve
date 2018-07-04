import React from 'React';
import RefEditing from './RefEditing.jsx';

export default class RefBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_RefBlock_expand = this._handleClick_RefBlock_expand.bind(this);
    this.style={
      Com_RefBlock_div_div: {
        width: '45%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      Com_RefBlock_div_div_icon: {
        display: 'inline-block',
        width: '42%',
        height: '45%',
        boxSizing: 'border-box',
        margin: '0 3% 0 0',
        border: '1px #FAFAFA',
        borderStyle: 'solid none solid solid',
        backgroundColor: '#FAFAFA',
        verticalAlign: 'top'
      }
    }
  }

  _handleClick_RefBlock_expand(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_focusBlock("ref");
    this.props._set_contentModalify(true);
  }

  render(){
    const self =this;
    let refsInBlock = this.props.refsArr.map(function(obj, index){
      return(
        <div
          key={'key_refsInBlock_'+index}
          style={self.style.Com_RefBlock_div_div_icon}>
          {obj.title}
        </div>
      )
    })
    return(
      <div
        style={this.props.componentStyle}>
        <div
          style={this.style.Com_RefBlock_div_div}
          onClick={this._handleClick_RefBlock_expand}>
          {refsInBlock}
        </div>
      </div>
    )
  }
}
