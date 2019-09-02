import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const styleMiddle = {
  comSimpleBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexWrap: 'wrap'
  },
  frameNail: {
    display: 'inline-block',
    width: '32.5%',
    height: '19rem',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 0 18px',
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

      // Block are builded to deal with the need of interrupted data fetching
      //each kind of Block represent a kind of arrange style,
      //only decide 'how many' & 'how to' in this component.
      //so the style of each nail inside, should return to the upper level to decide
      return (
        <div
          key={"key_Block_simple"+index}
          style={styleMiddle.frameNail}>
          {
            React.cloneElement(this.props.children, {
              unitId: unitId,
              unitBasic: this.props.unitsBasic[unitId]
            })
          }
        </div>
      )
    });

    return list;
  }

  render(){
    return (
      <div
        style={styleMiddle.comSimpleBlock}>
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
