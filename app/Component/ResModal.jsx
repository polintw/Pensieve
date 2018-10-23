import React from 'React';
import {connect} from "react-redux";
import EditingModal from './Share/EditingModal.jsx';

class ResModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_CreateShare_SubmitFile = this._handleClick_CreateShare_SubmitFile.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      Com_Modal_ResModal: {

      }
    }
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
    this.props._set_axios(true);
    //don't set any parameter in the callback,
    //would take the variable above directly
    this._axios_post_Share_new(newShareObj);
  }

  _axios_post_Share_new(newObj){
    const self = this;
    axios.post('/router/user/'+self.props.userInfo.id+'/shareds?primer='+this.props.unitId, newObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function (res) {
        if(res.status = 201){
          console.log("share created successfully!");
          self.props._set_axios(false);
          self._submit_Share_New();
        }else{
          console.log("Failed: "+ res.data.err);
          self.props._set_axios(false);
          alert("Failed, please try again later");
        }
    }).catch(function (error) {
      console.log(error);
      self.props._set_axios(false);
      alert("Failed, please try again later");
    });
  }

  _submit_Share_New(){
    window.location.assign("/cosmic/units/"+this.props.unitId+"/related");
  }

  render(){
    return(
      <div
        style={this.props.mode?this.style.Com_Modal_ResModal:{display:"none"}}>
        <EditingModal
          _set_Submit={this._handleClick_CreateShare_SubmitFile}
          _set_Clear={this.props._set_Modalmode}/>
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
)(ResModal);
