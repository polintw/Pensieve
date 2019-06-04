import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NailBasic from '../Nails/NailBasic/NailBasic.jsx';

const styleMiddle = {
  frameNail: {
    display: 'inline-block',
    width: '284px',
    height: '20.5rem',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 0.8% 18px',
    boxShadow: '0 1px 1px -0.1rem, 0rem -0.05rem 2px -0.2rem',
    borderRadius: '0.7rem',
    overflow: 'hidden'
  },
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
        <div
          key={"key_Block_simple"+index}
          style={styleMiddle.frameNail}>
          <NailBasic
            {...this.props}
            unitId={unitId}
            unitBasic={this.props.unitsBasic[unitId]}
            marksBasic={this.props.marksBasic}/>
        </div>
      )
    });

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
