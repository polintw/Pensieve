import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';
import DraftDisplay from './DraftDisplay.jsx';

export default class MarkAuthorThreads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      threadsList: [],
      threadsData: {},
      participants: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this);
    this.style = {
      Com_MarkAuthorThreads_: {
        display: 'inline-block',
        width: '13vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '21vw',
        boxSizing: 'border-box',
        padding: '2% 3%',
        borderLeft: 'solid 1px white',
        color: '#FAFAFA'
      }
    };
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    let threadId = event.currentTarget.getAttribute('thread');
    this.props._set_openDialogue(threadId);
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/unit/general/threads?markId='+self.props.markKey;
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return {
              axios: false,
              threadsList: resObj.main.orderList,
              threadsData: resObj.main.threadsData,
              participants: resObj.main.participants
            }
          });
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const self = this;
    let threads = this.state.threadsList.map((threadId, index)=>{
      let dataObj = self.state.threadsData[threadId];
      return (
        <div
          key={"key_AuthorThreads_"+threadId}
          thread={threadId}
          onClick={self._handleClick_openDialogue}>
          <div>
            <DraftDisplay
              editorState={dataObj.editorContent}/>
          </div>
          <span>{self.state.participants[threadId]['account']}</span>
          <span>{dataObj.lastTime}</span>
        </div>
      )
    })

    return(
      <div
        style={this.style.Com_MarkAuthorThreads_}>
        {threads}
      </div>
    )
  }
}
