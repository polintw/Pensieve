import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import NailBasic from '../Nails/NailBasic/NailBasic.jsx';
import NailInspired from '../Nails/NailInspired.jsx';

const styleMiddle = {
  comWindowAccu: {

  },
  boxBlocks: {

  },
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

class MixBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BlockByType = this._render_BlockByType.bind(this);
    this.style={

    }
  }

  _render_BlockByType(){
    const self = this;
    let list = this.props.mixList.map((item, index)=>{
      let type = item["type"],
          itemId = item["id"],
          nail;

      switch (type) {
        case "shared":
          nail = (
            <NailBasic
              {...self.props}
              unitId={itemId}
              unitBasic={self.props.unitsBasic[itemId]}
              marksBasic={self.props.marksBasic}/>
          )
          break;
        case "inspired":
          let markBasic = self.props.marksBasic[itemId];
          nail = (
            <NailInspired
              {...self.props}
              markId={itemId}
              unitId={markBasic.unitId}
              unitBasic={self.props.unitsBasic[markBasic.unitId]}
              markBasic={markBasic}/>
          )
          break;
        default:

      }

      return (
        <div
          key={'key_nails_mix_'+type+"_"+itemId}
          style={styleMiddle.frameNail}>
          {nail}
        </div>

      )
    })

    return list;
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        {this._render_BlockByType()}
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

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MixBlock));
