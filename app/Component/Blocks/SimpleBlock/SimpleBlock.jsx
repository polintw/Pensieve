import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

const styleMiddle = {
  comSimpleBlock: {
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'space-between',
    flexWrap: 'wrap'
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
          className={classnames(
            styles.frameNail,
            {[styles.frameTwo]: this.props['divide-two']}
          )}>
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
