import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import NavWalls from './NavWalls/NavWalls.jsx';
import NotifyBell from './Notify/NotifyBell.jsx';

const commonStyle = {
  boxOnDark: {
    display: 'inline-block',
    width: '382px',
    position: 'relative',
    boxSizing: 'border-box',
    top: '-21%',
    float: 'right',
    boxShadow: '0px 0.14rem 0.1rem -0.07rem',
    borderRadius: '0px 0px 0.6vh 0.6vh',
    backgroundColor: 'white'
  },
  boxNavWalls: {
    display: 'inline-block',
    height: '86%',
    position: 'absolute',
    left: '2%',
    transform: 'translate(0, -16%)',
    boxSizing: 'border-box'
  },
  boxNotifyBell: {
    width: '100%',
    height: '86%',
    position: "absolute",
    transform: 'translate(0px, -16%)',
    boxSizing: 'border-box',
    right: '0'
  },
  boxButtonSeries: {
    position: 'absolute',
    bottom: '124%',
    boxSizing: 'border-box'
  },
}

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_: {

      },
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavsCognition_}>
        <div
          className={"selfFront-fixedBottomBox-height"}
          style={commonStyle.boxOnDark}>
          <div
            style={commonStyle.boxNotifyBell}>
            <NotifyBell/>
          </div>
          <div
            style={commonStyle.boxNavWalls}>
            <NavWalls {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}
