import React from 'react';
import {connect} from "react-redux";
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {
  setUnitInspired
} from "../../../redux/actions/general.js";

const styleMiddle = {
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.12rem',
    lineHeight: '1.9rem',
    fontWeight: '400',
    color: '#f7f4bc'
  }
}

class ViewerBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_inspire_plain = this._axios_inspire_plain.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
    this.style = {
      Com_ViewerBlock_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_ViewerBlock_content_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '49%',
        minHeight: '54%',
        maxHeight: '154%', //the target MaxHeight is 64%, limit by parent
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
        width: '100%',
        height: '14%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%',
        float: 'right'
      },
      Com_ViewerBlock_panel_interaction_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      },
      Com_ViewerBlock_panel_interaction_bulb:{
        width: '24px',
        height: '100%',
        position: 'absolute',
        top: '0',
        boxSizing: 'border-box',
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

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;
    let styleByMidline = {
      editor: downToMdidline ? {bottom: '38%', position: 'absolute', right:toCircleLeft?'0':'',left:toCircleLeft?'':'0' }:{},
      panel: downToMdidline ? {bottom: '18%', position: 'absolute'}:{},
      credits: downToMdidline ? {bottom: '0', position: 'absolute'}:{},
    },
    styleByCircle = {
      bulb: toCircleLeft?{right: '12%'}:{left: '6%'}
    }
    return(
      <div
        style={this.style.Com_ViewerBlock_}>
        <div
          style={
            Object.assign({},
              this.style.Com_ViewerBlock_content_,
              {float: toCircleLeft? 'right':'left'},
              styleByMidline.editor
            )}>
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
          style={Object.assign({},this.style.Com_ViewerBlock_panel_, styleByMidline.panel)}>
          <div
            style={this.style.Com_ViewerBlock_panel_interaction_}>
            <div
              style={
                Object.assign({},
                  this.style.Com_ViewerBlock_panel_interaction_bulb,
                  {fill: this.props.unitCurrent.marksInteraction[this.props.markKey]['inspired'] ? '#ff7a5f':'transparent'},
                  styleByCircle.bulb
                )}
              onClick={this._handleClick_Inspired}>
              <SvgBulbPlainHalf/>
            </div>
          </div>
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
