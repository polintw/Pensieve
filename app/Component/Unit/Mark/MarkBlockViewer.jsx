import React from 'react';
import MarkDialogue from './MarkDialogue.jsx';
import SvgBulb from '../../SvgBulb.jsx';
import SvgPropic from '../../SvgPropic.jsx';
import DraftDisplay from '../../DraftDisplay.jsx';

export default class MarkBlockViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      dialogue: false,
      inspired: this.props.markData.inspired
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_postInspired = this._axios_postInspired.bind(this);
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
    this.style = {
      Com_MarkBlockViewer_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlockViewer_content_: {
        width: '100%',
        minHeight: '22vh',
        maxHeight: '60vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlockViewer_panel_: {
        width: '100%',
        minHeight: '22vh',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_MarkBlockViewer_panel_interaction_: {
        width: '100%',
        height: '5vh',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_MarkBlockViewer_panel_interaction_bulb:{
        width: '15%',
        height: '100%',
        position: 'relative',
        float: 'right',
        cursor: 'pointer'
      },
      Com_MarkBlockViewer_panel_interaction_raise: {
        width: '18%',
        height: '100%',
        position: 'relative',
        float: 'right'
      },
      Com_MarkBlockViewer_panel_dialogue: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
      Com_MarkBlockViewer_panel_credits_: {
        width: '100%',
        height: '8vh',
        position: 'relative',
        boxSizing: 'border-box'
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_MarkBlockViewer_}>
        <div
          style={this.style.Com_MarkBlockViewer_content_}>
          <DraftDisplay
            editorState={this.props.markData.editorContent}/>
        </div>
        <div
          style={this.style.Com_MarkBlockViewer_panel_}>
          {
            this.state.dialogue &&
            <div
              style={this.style.Com_MarkBlockViewer_panel_dialogue}>
              <MarkDialogue
                markKey={this.props.markKey}/>
            </div>
          }
          <div
            style={this.style.Com_MarkBlockViewer_panel_interaction_}>
            <div
              style={this.style.Com_MarkBlockViewer_panel_interaction_bulb}
              onClick={this._handleClick_Inspired}>
              <SvgBulb
                light={this.state.inspired ? true : false}/>
            </div>
            <span
              style={this.style.Com_MarkBlockViewer_panel_interaction_raise}
              onClick={this._handleClick_openDialogue}>
              {'舉手'}
            </span>
          </div>
          <div
            style={this.style.Com_MarkBlockViewer_panel_credits_}>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
            <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          </div>
          <div>
            {"多行參考資料連結"}
          </div>
        </div>
      </div>
    )
  }
}
