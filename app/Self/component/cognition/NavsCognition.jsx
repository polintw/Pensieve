import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import NavWalls from './NavWalls/NavWalls.jsx';

const commonStyle = {
  boxonDark: {
    width: '100%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxButtonCollateral:{
    width: '20%',
    height: '100%',
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box',
    color: "#757575"
  },
  boxNavWalls: {
    width: '72%',
    height: '100%',
    position: 'absolute',
    bottom: '0%',
    left: '7%',
    boxSizing: 'border-box',
    boxShadow: '0px 0.18vh 0.01vh -0.03vh',
    borderRadius: '0px 0px 0.6vh 0.6vh',
    backgroundColor: 'white'
  }
}

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_: {

      },
      selfCom_NavsCognition_inCognition_: {
        minWidth: '448px',
        height: '60.5px',
        position: 'fixed',
        bottom: '0',
        right: '49%',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavsCognition_}>
        <div
          style={this.style.selfCom_NavsCognition_inCognition_}>
            <div
              className={"selfFront-fixedBottomBox-height"}
              style={commonStyle.boxonDark}>
              <div
                style={commonStyle.boxNavWalls}>
                <NavWalls {...this.props} />
              </div>
            </div>
        </div>
      </div>
    )
  }
}
