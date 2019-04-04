import React from 'react';
import {connect} from "react-redux";
import MarkDialogue from './MarkDialogue.jsx';
import {SvgBulb} from '../../Svg/SvgBulb.jsx';
import SvgPropic from '../../Svg/SvgPropic.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

class AuthorBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      dialogue: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_inspire_plain = this._axios_inspire_plain.bind(this);
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_AuthorBlock_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      },
      Com_AuthorBlock_content_: {
        width: '100%',
        minHeight: '22vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_AuthorBlock_panel_: {
        width: '100%',
        minHeight: '22vh',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_AuthorBlock_fold_:{
        display: 'none'
      },
      Com_AuthorBlock_fold_dialogue: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
      Com_AuthorBlock_panel_interaction_: {
        width: '100%',
        height: '5vh',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_AuthorBlock_panel_interaction_bulb:{
        width: '15%',
        height: '100%',
        position: 'relative',
        float: 'right',
        cursor: 'pointer'
      },
      Com_AuthorBlock_panel_interaction_raise: {
        width: '18%',
        height: '100%',
        position: 'relative',
        float: 'right'
      },
      Com_AuthorBlock_panel_credits_: {
        width: '100%',
        height: '8vh',
        position: 'relative',
        boxSizing: 'border-box'
      }
    };
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

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_AuthorBlock_}>
        <div
          style={this.style.Com_AuthorBlock_content_}>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={this.style.Com_AuthorBlock_panel_}>
          <div
            style={this.style.Com_AuthorBlock_panel_interaction_}>
            <div
              style={this.style.Com_AuthorBlock_panel_interaction_bulb}>
              <SvgBulb light={false}/>
            </div>
            <span
              style={this.style.Com_AuthorBlock_panel_interaction_raise}
              onClick={this._handleClick_openDialogue}>
              {'raise hand'}
            </span>
          </div>
          <div
            style={this.style.Com_AuthorBlock_panel_credits_}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div>
            {"(多行參考資料連結)"}
          </div>
        </div>
        <div
          style={this.style.Com_AuthorBlock_fold_}>
          {
            this.state.dialogue &&
            <div
              style={this.style.Com_AuthorBlock_fold_dialogue}>
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
)(AuthorBlock);
