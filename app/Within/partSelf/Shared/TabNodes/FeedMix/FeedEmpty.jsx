import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../../../../Unit/Editing/CreateShare.jsx';

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
          className={classnames(styles.boxTitle, styles.boxEmptyDescript)}>
          <span
            className={classnames("fontTitleSmall", "colorLightGrey")}>
            {
              this.props.customFilterCate.length > 0 ?  this.props.i18nUIString.catalog['guiding_noAccumulated_selfAccumulationsNodes'][0] :
              this.props.i18nUIString.catalog['guiding_noAccumulated_selfAccumulationsNodes'][1]
            }
          </span>
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
