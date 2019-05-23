import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
}

class ExploreNouns extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nouns_usedList = this._render_nouns_usedList.bind(this);
    this._render_nouns_randomList = this._render_nouns_randomList.bind(this);
    this.style={

    }
  }

  _render_nouns_usedList(){

  }

  _render_nouns_randomList(){

  }

  componentDidMount() {
    //load nouns from attribution
    //and random nouns as recommandation

    //use api /explore to get nounsList
    //dispatch to redux get the nounsBasic
    //promise of dispatch to set nounsList(both from attri. & recommand) into state
    //then _render
  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={styleMiddle.comExplore}>
        <div>
          {this._render_nouns_usedList()}
        </div>
        <div>{"or be the First revealing these place! "}</div>
        <div>
          {this._render_nouns_randomList()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreNouns));
