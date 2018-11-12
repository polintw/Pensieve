import React from 'React';
import {connect} from "react-redux";
import EditingModal from './EditingModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';

class CreateShare extends React.Component {
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
      Com_CreateShare_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
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
      "coverSrc",
      "nounsArr"
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
    let joinedMarks = newObj.coverMarks.concat(newObj.beneathMarks);
    const newShareObj = {
      coverBase64: newObj.coverSrc,
      beneathBase64: newObj.beneathSrc,
      joinedMarks: joinedMarks,
      refsArr: newObj.refsArr,
      nounsArr: newObj.nounsArr,
      submitTime: submitTime
    };
    //don't set any parameter in the callback,
    //would take the variable above directly
    this.setState((pveState, props) => {return {axios: true};}, () => {
      this._axios_post_Share_new(newShareObj);
    })
  }

  _axios_post_Share_new(newObj){
    const self = this;
    axios.post('/router/user/'+self.props.userInfo.id+'/shareds', newObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function (res) {
        if(res.status = 201){
          console.log("share created successfully!");
          self.setState({editingModal: false, axios: false});
          self.props._submit_Share_New();
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
        style={this.style.Com_CreateShare_}
        onClick={this._handleClick_CreateShare_init}>
        {
          this.state.editingModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._handleClick_CreateShare_clear} style={{position: "fixed"}}>
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

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(CreateShare);
