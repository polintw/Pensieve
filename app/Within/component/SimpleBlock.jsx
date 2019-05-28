import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NailBasic from '../../Component/Nails/NailBasic/NailBasic.jsx';

const styleMiddle = {

}

class SimpleBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this._render_SimpleBlock = this._render_SimpleBlock.bind(this);
  }

  _render_SimpleBlock(){
    let list = this.props.unitsList.map((unitId, index)=>{
      return (
        <NailBasic
          key={"key_Block_simple"+index}
          {...this.props}
          unitId={unitId}
          unitBasic={this.props.unitsBasic[unitId]}
          marksBasic={this.props.marksBasic}/>
      )
    })

    return list;
  }

  render(){
    return (
      <div>
        {this._render_SimpleBlock()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(SimpleBlock));
