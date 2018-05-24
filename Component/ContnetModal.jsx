import React from 'React';
import PicEditingRef from './PicEditingRef.jsx';
import ContenrModalMark from './ContenrModalMark.jsx';
import ModalBox from './general/ModalBox.jsx';

export default class ContentModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_FocusType = this._render_FocusType.bind(this);
    this.style={

    }
  }

  _render_FocusType(){
    switch (this.state.editingBlock) {
      case 'cover':
        return(
          <ContenrModalMark
            blockName={'cover'}
            imgSrc={this.props.coverSrc}
            marksData={this.props.coverData}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this.props._close_Mark_Complete}
            _close_editingCancell={this.props._close_editingCancell}/>
        )
        break;
      case 'beneath':
        return(
          <ContenrModalMark
            blockName={'beneath'}
            imgSrc={this.props.beneathSrc}
            marks={this.props.beneathData}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this.props._close_Mark_Complete}
            _close_editingCancell={this.props._close_editingCancell}/>
        )
        break;
      case 'ref':
        return(
          <PicEditingRef
            blockName={'ref'}
            refsArr = {this.state.refsArr}
            _set_refsArr={this.props._set_refsArr}/>
        )
        break;
      default:
        return(<div></div>)
    }
  }

  render(){
    return(
      <ModalBox containerId="editingModal">
        <div>
          {this._render_FocusType()}
        </div>
      </ModalBox>
    )
  }
}
