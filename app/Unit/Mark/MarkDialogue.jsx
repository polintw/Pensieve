import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';
import DraftEditor from '../../Component/Draft/DraftEditor.jsx';
import DraftDisplay from '../../Component/Draft/DraftDisplay.jsx';

export default class MarkDialogue extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      threadId: null,
      dialogueOrderList: [],
      dialoguesData: {},
      talkerAccount: {},
      newStatementEditor: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_sendDialogue = this._handleClick_sendDialogue.bind(this);
    this._axios_post_Dialogue_new = this._axios_post_Dialogue_new.bind(this);
    this.style = {
        Com_MarkDialogue_: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            boxSizing: 'border-box'
        },
        Com_MarkDialogue_new_: {

        }
    };
  }

  _axios_post_Dialogue_new(submitObj){
    const self = this;
    axios.post('/router/user/action/dialogue?aim=new', submitObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function (res) {
        if(res.status = 200){
          console.log("dialogue post successfully!");
          self.setState((prevState, props)=>{
            let localUseId = "local_"+prevState.dialogueOrderList.length;
            prevState.dialogueOrderList.push(localUseId);
            prevState.dialoguesData[localUseId] = {editorContent: JSON.parse(submitObj.editorContent), talker: "(authorId)"}; //wait for reducer usage
            return {
              axios: false,
              threadId: res.data.main.threadId,
              dialogueOrderList: prevState.dialogueOrderList,
              dialoguesData: prevState.dialoguesData,
              newStatementEditor: null
            };
          });
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

  _handleClick_sendDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    let submitObj = {
      markId: this.props.markKey,
      threadId: this.state.threadId,
      editorContent: JSON.stringify(convertToRaw(this.newStatement.state.editorState.getCurrentContent()))
    };
    //don't set any parameter in the callback,
    //would take the variable above directly
    this.setState((prevState, props) => {return {axios: true};}, ()=>{
      this._axios_post_Dialogue_new(submitObj)
    })
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/';
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
              threadId: resObj.main.threadId,
              dialogueOrderList: resObj.main.orderList,
              dialoguesData: resObj.main.dialoguesData,
              talkerAccount: resObj.main.talkerAccount,
              newStatementEditor: null
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
    let path = this.state.dialogueOrderList.map(function(dataKey, index){
        return (
          <div
            key={"key_dialogues_"+self.state.threadId+"_"+dataKey}>
            <div>
              <DraftDisplay
                editorState={self.state.dialoguesData[dataKey].editorContent}/>
            </div>
            <div>
              {self.state.dialoguesData[dataKey].talker}
            </div>
          </div>
        )
    })
    return(
      <div
        style={this.style.Com_MarkDialogue_}>
        <div>
            {path}
        </div>
        <div
          style={this.style.Com_MarkDialogue_new_}>
          <div>
            <DraftEditor
              ref={(element)=>{this.newStatement = element;}}
              editorState={this.state.newStatementEditor}/>
          </div>
          <span
            onClick={this._handleClick_sendDialogue}>{"send"}</span>
        </div>
      </div>
    )
  }
}
