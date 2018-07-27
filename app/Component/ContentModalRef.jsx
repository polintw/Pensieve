import React from 'React';
import RefList from './RefList.jsx';
import RefEditing from './RefEditing.jsx';

export default class ContentModalRef extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_focusEditing_fin = this._handleClick_focusEditing_fin.bind(this);
    this.style={
      component_FocusEditingRef: {
        width: '90%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#131313',
        boxShadow: '0 1 -5px 5px'
      },
      component_refEditing: {
        outline: {
          width: "72%",
          height: '36%',
          position: 'absolute',
          top: "4%",
          left: '8%',
          boxSizing: 'border-box'
        },
        web_inputEditor: {
          width: '36%',
          height: '40%',
          position: 'absolute',
          top: '5%',
          left: '4%',
          boxSizing: 'border-box',
          padding: '3% 1%',
          borderBottom: "1px solid white",
          color: '#FAFAFA',
          cursor: 'text'
        },
        web_preview_outline: {
          width: '60%',
          height: '70%',
          position: 'absolute',
          top: '0',
          right: '0',
          boxSizing: 'border-box'
        },
        web_preview_body: {
          width: '90%',
          height: '80%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxSizing: 'border-box',
          border: '1px solid black',
          boxShadow: '0 1px 3px 1px'
        },
        web_panel: {
          width: '60%',
          height: '25%',
          position: 'absolute',
          bottom: '0',
          right: '0',
          boxSizing: 'border-box'
        }
      },
      div_refsBox: {
        width: '100%',
        height: '60%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        overflow: 'auto'
      },
      div_refsPanel: {
        width: '12%',
        height: '36%',
        position: 'absolute',
        top:'4%',
        left: '80%'
      },
      div_refsPanel_fin: {
        width: '80%',
        height: '20%',
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        boxSizing: 'border-box',
        border: '1px solid',
        borderRadius: '1px',
        backgroundColor: '#AF88EA',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_focusEditing_fin(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_focusBlockify(false);
    this.props._set_focusBlock(null);
  }

  render(){
    return(
      <div
        style={this.style.component_FocusEditingRef}>
        <RefEditing
          key={'key_refEditing_von_block'}
          componentStyleGroup={this.style.component_refEditing}
          _set_refArr_new={this.props._set_refsArr}/>
        <div
          style={this.style.div_refsBox}>
          <RefList
            refsArr={this.props.refsArr}/>
        </div>
        <div
          style={this.style.div_refsPanel}>
          <div
            style={this.style.div_refsPanel_fin}
            onClick={this._handleClick_focusEditing_fin}>
            {"完成"}
          </div>
        </div>
      </div>
    )
  }
}
/*
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
*/
