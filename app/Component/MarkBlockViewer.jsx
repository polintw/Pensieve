import React from 'react';
import MarkDialogue from './MarkDialogue.jsx';
import SvgBulb from './SvgBulb.jsx';
import DraftDisplay from './DraftDisplay.jsx';

export default class MarkBlockViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      dialogue: false,
      inspired: this.props.markData.inspired
    };
    this._axios_postInspired = this._axios_postInspired.bind(this);
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
    this.style = {
      Com_MarkBlockViewer_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlockViewer_content_: {
        display: 'inline-block',
        width: '21vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0'
      },
      Com_MarkBlockViewer_content_editor_: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2% 2% 2% 3%',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlockViewer_content_panel_: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_MarkBlockViewer_content_panel_raise:{
        width: '35%',
        height: '100%',
        float: 'right',
        cursor: 'pointer'
      },
      Com_MarkBlockViewer_dialogue_: {
        display: 'inline-block',
        width: '13vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '21vw',
        boxSizing: 'border-box',
        padding: '2% 3%',
        borderLeft: 'solid 1px white',
        color: '#FAFAFA',
      },
      Com_MarkBlockViewer_side_: {
        display: 'inline-block',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      Com_MarkBlockViewer_side_thanks_: {
        display: 'inline-block',
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_MarkBlockViewer_side_bottom_bulb: {
        width: '30%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        right: '2%'
      }
    };
  }

  _axios_postInspired(aim){
    const self = this;
    axios.post('/router/user/action/inspired?aim='+aim, {
      "markKey": self.props.markKey
    }, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function (res) {
        if(res.status = 200){
          console.log("inspired action post successfully!");
          self.setState({inspired: aim=='new'?true:false, axios: false});
        }else{
          console.log("Failed: "+ res.data.err);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
    }).catch(function (error) {
      console.log(error);
      self.setState({axios: false});
      alert("Failed, please try again later");
    })

  }
  _handleClick_Inspired(event){
    event.preventDefault();
    event.stopPropagation();

    let aim = this.state.inspired ? 'delete': 'new';
    this.setState((prevState, props)=>{
      return {axios: true}
    }, this._axios_postInspired(aim))
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return this.state.dialogue?{dialogue: false}: {dialogue: true}})
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_MarkBlockViewer_}>
        <div
          style={this.style.Com_MarkBlockViewer_content_}>
          <div
            style={this.style.Com_MarkBlockViewer_content_editor_}>
            <DraftDisplay
              editorState={this.props.markData.markEditorContent}/>
          </div>
          <div
            style={this.style.Com_MarkBlockViewer_content_panel_}>
            <span>{'編輯紀錄'}</span>
            <span
              style={this.style.Com_MarkBlockViewer_content_panel_raise}
              onClick={this._handleClick_openDialogue}>
              {'舉手'}
            </span>
          </div>
        </div>
        {
          this.state.dialogue &&
          <div
            style={this.style.Com_MarkBlockViewer_dialogue_}>
            <MarkDialogue
              markKey={this.props.markKey}
              threadId={null}/>
          </div>
        }
        <div
          style={
            this.state.dialogue?Object.assign({width: '2vw'}, this.style.Com_MarkBlockViewer_side_):
            Object.assign({width: '12vw'}, this.style.Com_MarkBlockViewer_side_)}>
          <div
            style={this.style.Com_MarkBlockViewer_side_thanks_}>

          </div>
          <div
            style={this.style.Com_MarkBlockViewer_side_bottom_bulb}
            onClick={this._handleClick_Inspired}>
            <SvgBulb
              light={this.state.inspired ? true : false}/>
          </div>
        </div>
      </div>
    )
  }
}
