import React from 'react';
import {connect} from "react-redux";
import MarkDialogue from './MarkDialogue.jsx';
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import SvgPropic from '../../Svg/SvgPropic.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

const styleMiddle = {
  boxInteraction: {
    display: 'inline-block',
    width: '100%',
    position: 'absolute',
    top: '100%',
    right: '0',
    boxSizing: 'border-box',
  },
  boxPanelInteraction: {
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.18rem',
    lineHeight: '1.9rem',
    fontWeight: '300',
    color: '#f0f0f0',
    cursor: 'pointer'
  }
}

class ViewerBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      dialogue: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_inspire_plain = this._axios_inspire_plain.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
    this._handleClick_jumpMark = this._handleClick_jumpMark.bind(this);
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_ViewerBlock_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '56%',
        minHeight: '54%',
        maxHeight: '154%',//the target MaxHeight is 64% to the entire img
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_ViewerBlock_content_: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        paddingBottom: '7%',
        paddingLeft: '6%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflowY: 'auto'
      },
      Com_ViewerBlock_panel_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%'
      },
      Com_ViewerBlock_credits_: {
        display: 'inline-block',
        width: '100%',
        height: '2.6rem',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%',
      },
      Com_ViewerBlock_fold_:{
        display: 'none'
      },
      Com_ViewerBlock_fold_dialogue: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
      Com_ViewerBlock_panel_interaction_bulb:{
        width: '17px',
        margin: '0 4%',
        cursor: 'pointer',
        strokeWidth:'10px',
        stroke: '#f7f4bc'
      }
    };
  }

  _handleClick_Inspired(event){
    event.preventDefault();
    event.stopPropagation();
    let aim = this.props.unitCurrent.marksInteraction[this.props.markKey]['inspired'] ? 'delete': 'post';

    this.setState((prevState, props)=>{
      return {axios: true}
    }, this._axios_inspire_plain(aim))
  }

  _axios_inspire_plain(aim){
    const self = this;
    //'axios' in state has set to true in invoke instance
    axios({
      method: aim,
      url: '/router/inspire?unitId='+self.props.unitCurrent.unitId+'&markId='+self.props.markKey,
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']}
    }).then(function (res) {
      if(res.status = 200){
        self.props._set_inpiredMark(self.props.markKey, aim);
      }else{
        console.log("Failed: "+ res.data.err);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return this.state.dialogue?{dialogue: false}: {dialogue: true}})
  }

  _handleClick_jumpMark(event){
    event.preventDefault();
    event.stopPropagation();
    let direction = event.currentTarget.getAttribute('jump');
    this.props._set_markJump(direction, this.props.currentSerial);
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;// both props come from OpenedMark
    //we use these two cosnt to tune the position of whole <div> for not protruding out the view

    return(
      <div
        style={Object.assign({},
          this.style.Com_ViewerBlock_,
          {bottom: downToMdidline ? '38%':'', float: toCircleLeft? 'right':'left'})}
        onClick={(e)=>{e.stopPropagation();}}>
        <div
          style={Object.assign({}, this.style.Com_ViewerBlock_content_)}>
          <div
            style={{
              width: '48%',
              height: ' 42%',
              position:'absolute',
              left: '0',
              bottom:'0%',
              borderLeft: 'solid 1px #ababab',
              borderBottom: 'solid 1px #ababab'}}></div>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={styleMiddle.boxInteraction}>
          <div
            style={Object.assign({},this.style.Com_ViewerBlock_panel_)}>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {float: 'left'})}>
              <span
                style={styleMiddle.spanInteractions}
                onClick={this._handleClick_openDialogue}>
                {'raise'}
              </span>
            </div>
            <div
              style={Object.assign({},
                  styleMiddle.boxPanelInteraction,
                  this.style.Com_ViewerBlock_panel_interaction_bulb,
                  {fill: this.props.unitCurrent.marksInteraction[this.props.markKey]['inspired'] ? '#ff7a5f':'transparent'},
                  {float: 'left'})}
              onClick={this._handleClick_Inspired}>
              <SvgBulbPlainHalf/>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxPanelInteraction, {margin: '0 3%', float: 'right'})}>
              {
                (this.props.currentSerial> 0) &&
                <span
                  jump={'previous'}
                  style={Object.assign({}, styleMiddle.spanInteractions, {paddingRight: '0.45rem', fontSize: '1.32rem', letterSpacing:'0.1rem', color: 'rgba(173, 173, 173, 0.8)'})}
                  onClick={this._handleClick_jumpMark}>
                  {'previous  |'}</span>
              }
              <span
                jump={(this.props.currentSerial==(this.props.marksLength-1)) ? 'continue':'next'}
                style={Object.assign({}, styleMiddle.spanInteractions, {fontSize: '1.45rem', textShadow: '0px 0px 1px rgb(249, 253, 192)'})}
                onClick={this._handleClick_jumpMark}>
                {(this.props.currentSerial==(this.props.marksLength-1)) ? 'continue': 'next'}</span>
            </div>
          </div>
          <div
            style={Object.assign({}, this.style.Com_ViewerBlock_credits_)}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div
            style={{display: 'inline-block', position: 'relative'}}>
            {"(多行參考資料連結)"}
          </div>
        </div>
        <div
          style={this.style.Com_ViewerBlock_fold_}>
          {
            this.state.dialogue &&
            <div
              style={this.style.Com_ViewerBlock_fold_dialogue}>
              <MarkDialogue
                markKey={this.props.markKey}/>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_inpiredMark: (markId, aim)=>{dispatch(setUnitInspired(markId, aim));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewerBlock);
