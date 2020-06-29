import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import SvgIconError from '../../../Components/Svg/SvgIcon_Err.jsx';
import SvgIconChecked from '../../../Components/Svg/SvgIcon_Checked.jsx';

class MessageInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comMessageInput)}>
        <span
          className={classnames(
            styles.spanText,
            stylesFont.fontSubtitle,
            stylesFont.colorOrange
          )}>
          {this.props.messageText}
        </span>
        {
          this.props.messageIcon &&          
          <div
            className={classnames(styles.boxSvgIcon)}>
            {
              (this.props.messageIcon=="error") &&
              <SvgIconError/>
            }
            {
              (this.props.messageIcon=="checked") &&
              <SvgIconChecked/>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(MessageInput));
