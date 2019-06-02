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
import NailShared from '../Nails/NailShared.jsx';
import NailInspired from '../Nails/NailInspired.jsx';

const styleMiddle = {
  comWindowAccu: {

  },
  boxBlocks: {

  },
  frameNail: {
    display: 'inline-block',
    width: '32%',
    height: '205px',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '11px 0.7% 0 0'
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
            <NailShared
              {...self.props}
              sharedId={itemId}
              unitBasic={self.props.unitsBasic[itemId]}
              marksBasic={self.props.marksBasic}
              notifiedStatus={{inspired:null}}/>
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
