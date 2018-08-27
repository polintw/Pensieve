import React from 'react';
import DraftDisplay from '../../Component/DraftDisplay.jsx';
import SvgPropic from '../../Component/SvgPropic.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitModalify: false,
      focusMarkName: null,
      inspiredList: [],
      inspiredMarksSet:{},
      unitBasicSet: {}
    };
    this._handleClick_markNail = this._handleClick_markNail.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      selfCom_Inspired_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Inspired_nails_: {
        width: '100%',
        position: "absolute",
        top: '16vh',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      selfCom_Inspired_nails_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Inspired_nails_div_img: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      Com_UnitModal_BottomSection_author_: {
        width: '70%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '1%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_BottomSection_author_text: {
        display: 'inline-block',
        width: '90%',
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
      Com_UnitModal_BottomSection_author_propic_: {
        display: 'inline-block',
        width: '8%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_markNail(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusMarkName: event.currentTarget.getAttribute('markid')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusMarkName: null
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/user/cognition/inspired', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        inspiredList: resObj.main.inspiredList,
        inspiredMarksSet:resObj.main.inspiredMarksSet,
        unitBasicSet:resObj.main.unitBasicSet
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let inspireds = self.state.inspiredList.map(function(dataKey, index){
      let dataValue = self.state.inspiredMarksSet[dataKey];
      return(
        <div
          key={'key_Inspired_nails_'+index}
          markid={dataKey}
          style={self.style.selfCom_Inspired_nails_div_}
          onClick={self._handleClick_markNail}>
          <div>
            <DraftDisplay
              editorState={dataValue.markEditorContent}/>
          </div>
          <div>
            <div
              style={self.style.Com_UnitModal_BottomSection_author_}>
              <div style={self.style.Com_UnitModal_BottomSection_author_propic_}>
                <SvgPropic/>
              </div>
              <span style={self.style.Com_UnitModal_BottomSection_author_text}>
                {self.state.unitBasicSet[dataValue.unitId].author}
              </span>
            </div>
            <img
              src={'/router/img/'+self.state.unitBasicSet[dataValue.unitId].pic_layer0+'?type=thumb'}
              style={self.style.selfCom_Inspired_nails_div_img}/>
          </div>
        </div>
      )
    })

    return(
      <div
        style={this.style.selfCom_Inspired_}>
        <div
          style={this.style.selfCom_Inspired_nails_}>
          {inspireds}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitId={this.state.inspiredMarksSet[this.state.focusMarkName].unitId}
                unitInit={
                  Object.assign(this.state.unitBasicSet[this.state.inspiredMarksSet[this.state.focusMarkName].unitId], {marksify: true, initMark: this.state.focusMarkName, layer: this.state.inspiredMarksSet[this.state.focusMarkName].layer})
                }
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
