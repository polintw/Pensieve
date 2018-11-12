import React from 'React';
import {connect} from "react-redux";

class AuthorModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Modal_AuthorModal: {

      }
    }
  }



  render(){
    return(
      <div
        style={this.style.Com_Modal_AuthorModal}>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default connect(
  mapStateToProps,
  null
)(AuthorModal);
