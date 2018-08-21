import React from 'React';
import ContentModalRef from './ContentModalRef.jsx';
import ContentModalMark from './ContentModalMark.jsx';
import ModalBox from './ModalBox.jsx';

export default class ContentModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_FocusType = this._render_FocusType.bind(this);
    this.style={
      Com_Modal_ContentModal: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0%",
        left: '0'
      }
    }
  }

  _render_FocusType(){
    switch (this.props.focusBlock) {
      case 'cover':
        return(
          <ContentModalMark
            layer={0}
            imgSrc={this.props.coverSrc}
            marksArr={this.props.marksArr}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this.props._close_Mark_Complete}
            _close_img_Cancell={this.props._close_img_Cancell}/>
        )
        break;
      case 'beneath':
        return(
          <ContentModalMark
            layer={1}
            imgSrc={this.props.beneathSrc}
            marksArr={this.props.marksArr}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this.props._close_Mark_Complete}
            _close_img_Cancell={this.props._close_img_Cancell}/>
        )
        break;
      case 'ref':
        return(
          <ContentModalRef
            layer={2}
            refsArr = {this.props.refsArr}
            _set_refsArr={this.props._set_refsArr}/>
        )
        break;
      default:
        return(<div></div>)
    }
  }

  render(){
    return(
      <ModalBox containerId="root">
        <div
          style={this.style.Com_Modal_ContentModal}>
          {this._render_FocusType()}
        </div>
      </ModalBox>
    )
  }
}
