import React from 'React';
import EditingModal from './EditingModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';

export default class CreateShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingModal: false,
      axios: false
    };
    this._open_editingModal = () => {this.setState({editingModal: true})};
    this._close_editingModal = () => {this.setState({editingModal: false})};
    this._handleClick_CreateShare_init = this._handleClick_CreateShare_init.bind(this);
    this._handleClick_CreateShare_clear = this._handleClick_CreateShare_clear.bind(this);
    this._handleClick_CreateShare_SubmitFile = this._handleClick_CreateShare_SubmitFile.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this.style={
      div_Com_CreateShare_Button: {
        width: '45%',
        height: '15vh',
        position: 'absolute',
        top: '5vh',
        right: '0',
        boxSizing: 'border-box',
        border: '0.5vw solid black',
        boxShadow: '0 1vh 2vh 1vh',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_CreateShare_init(event){
    event.stopPropagation();
    event.preventDefault();
    this._open_editingModal();
  }

  _handleClick_CreateShare_clear(event){
    this.setState({
      editingModal: false
    })
  }

  _handleClick_CreateShare_SubmitFile(stateObj){
    //check form filled
    let pause = false;
    let required = [
      coverSrc,
      nounsArr
    ];
    required.forEach(function(key, index){
      if(!stateObj[key] || stateObj[key].length < 1) {pause = true;};
    })
    if(pause){alert("fill the required area");return;};

    let self = this;
    let d = new Date();
    let submitTime = d.getTime();
    //prevent data lost during unmount.
    let newObj = {};
    Object.assign(newObj, stateObj);
    const newShareObj = {
      coverBase64: newObj.coverSrc,
      beneathBase64: newObj.beneathSrc,
      coverMarksObj: newObj.coverMarks,
      beneathMarksObj: newObj.beneathMarks,
      refsArr: newObj.refsArr,
      nounsArr: newObj.nounsArr
      submitTime: submitTime
    };
    this.setState({axios: true}, (newObj) => {
      this._axios_post_Share_new(newObj);
    })
  }

  _axios_post_Share_new(newObj){
    const self = this;
    axios.post('/post/user/share/new', newObj, {
      headers: {'Content-Type': 'application/json', 'charset': 'utf-8'}
    }).then(function (res) {
        if(res.status = 200){
          console.log("success");
          self.setState({editingModal: false, axios: false});
          self.props._submit_Share_New(newObj);
        }else{
          console.log("Failed: "+ res.data.err);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
    }).catch(function (error) {
      console.log(error);
      self.setState({axios: false});
      alert("Failed, please try again later");
    });
  }

  render(){
    return(
      <div
        className={}
        style={this.style.div_Com_CreateShare_Button}
        onClick={this._handleClick_CreateShare_init}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 426 1">
          <defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}</style></defs>
          <title>資產 1</title>
          <g id="圖層_2" data-name="圖層 2">
            <g id="圖層_1-2" data-name="圖層 1">
              <line class="cls-1" y1="0.5" x2="426" y2="0.5"/>
            </g>
          </g>
        </svg>
        {
          this.state.editingModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._handleClick_CreateShare_clear}>
              <EditingModal
                _set_Submit={this._handleClick_CreateShare_SubmitFile}
                _set_Clear={this._handleClick_CreateShare_clear}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
