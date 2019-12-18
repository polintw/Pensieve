import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import NodeWished from './NodeWished.jsx'

class Wish extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wishedList: []
    };
    this._render_Wished = this._render_Wished.bind(this);
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_Wished(){
    let itemsDOM = [];

    for(let i= 0; i< 3; i++){
      itemsDOM.push(
        <NodeWished
          listIndex={i}
          wishedNode={this.state.wishedList[i]}/>
      )
    }
  }

  render(){
    return(
      <div
        className={classnames()}>
        {this._render_Wished()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wish));
