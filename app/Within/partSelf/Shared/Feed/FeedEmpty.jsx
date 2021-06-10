import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BtnUpload from '../../../../Unit/Editing/BtnUpload/BtnUpload.jsx';

class FeedEmpty extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onInvite: false
    };
    this._handleEnter_Invite = this._handleEnter_Invite.bind(this);
    this._handleLeave_Invite = this._handleLeave_Invite.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comFeedEmpty}>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontContent", "colorLightGrey")}>
          <span style={{display: 'inline-block', width: '221px'}}>
            {this.props.i18nUIString.catalog['guiding_noAccumulated_selfPageExplain'][1]}
          </span>
          <br/>
        </div>
        <div
          className={classnames(styles.boxEmptyUpload)}>
          <BtnUpload
            {...this.props}
            styleTextBright={false}
            customTextStyle={{color: '#757575'}}
            _submit_Share_New={this.props._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
  }

  _handleEnter_Invite(e){
    this.setState({onInvite: true})
  }

  _handleLeave_Invite(e){
    this.setState({onInvite: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedEmpty));
