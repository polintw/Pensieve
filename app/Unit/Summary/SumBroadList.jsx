import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {AccountPlate} from '../../Component/AccountPlate.jsx';
import {
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class SumBroadList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      modalAll: false,
      onListItem: '',
      onExpand: false,
      onClose: false,
      usersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_broadList = this._render_broadList.bind(this);
    this._axios_get_listBroad = this._axios_get_listBroad.bind(this);
    this._handleEnter_listItem = this._handleEnter_listItem.bind(this);
    this._handleLeave_listItem = this._handleLeave_listItem.bind(this);
    this._handleMouse_onExpand = this._handleMouse_onExpand.bind(this);
    this._handleMouse_onClose = this._handleMouse_onClose.bind(this);
    this._handleClick_list_toggle = this._handleClick_list_toggle.bind(this);
    this.style={

    };
  }

  _handleEnter_listItem(e){
    this.setState({
      onListItem: e.currentTarget.attributes.user.value
    })
  }

  _handleLeave_listItem(e){
    this.setState({
      onListItem: ''
    })
  }

  _handleMouse_onExpand(e){
    this.setState((prevState, props)=>{
      return {onExpand: prevState.onExpand? false: true}
    })
  }

  _handleMouse_onClose(e){
    this.setState((prevState, props)=>{
      return {onClose: prevState.onClose? false: true}
    })
  }

  _handleClick_list_toggle(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{
      return {
        modalAll: prevState.modalAll ? false : true
      }
    });
  }

  _axios_get_listBroad(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/broad/'+this.props.unitCurrent.unitId, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      //submit change to reducer
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.setState({
        axios: false,
        usersList: resObj.main.usersList
      });

    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if( !(prevProps.unitCurrent.broad===this.props.unitCurrent.broad) ){ //unitCurrent.broad is a boolean, need compare by '===' to avoid complicated exceptions
      this._axios_get_listBroad();
    }
  }

  componentDidMount(){
    this._axios_get_listBroad();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  _render_broadList(){
    let listDOM = this.state.usersList.map((userId, index)=>{
      let userLink = (userId == this.props.userInfo.id) ? `/user/screen`: `/cosmic/users/${userId}/accumulated`;

      return (
        <div
          key={"key_BroadList_item_"+index}
          className={classnames(styles.comSum_boxListItem)}>
          {
            (userId in this.props.usersBasic) &&
            <a
              user={userId}
              href= {userLink}
              className={classnames(
                'plainLinkButton',
                styles.comSum_boxListLink,
                styles.comSum_fontListItem
              )}
              onMouseEnter={this._handleEnter_listItem}
              onMouseLeave={this._handleLeave_listItem}>
              {
                (this.state.onListItem==userId) &&
                <span style={{
                    width: '84%', position: 'absolute', bottom: '-7%', left: '5%',
                    borderBottom: 'solid 1px #FAFAFA'
                  }}/>
              }
              <AccountPlate
                size={'layer'}
                accountFisrtName={this.props.usersBasic[userId].firstName}
                accountLastName={this.props.usersBasic[userId].lastName}
                styleFirst={{fontWeight: '400', fontSize: '1.32rem', letterSpacing: '0.05rem'}}
                styleLast={{fontWeight: '300', fontSize: '1.32rem', letterSpacing: '0.05rem'}}/>
            </a>
          }
        </div>
      )
    });

    return listDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comSum_Broad)}>
        <div
          className={classnames(styles.comSum_boxList)}>
          {this._render_broadList()}
        </div>
        <div
          className={classnames(styles.comSum_boxDescript, styles.comSum_fontDescript)}>
          {
            (this.state.usersList.length > 4) &&
            <span
              className={classnames(styles.comSum_spanExpand, styles.comSum_fontExpand)}
              style={
                this.state.onExpand? {color: 'rgb(64, 133, 160)'} : {}
              }
              onClick={this._handleClick_list_toggle}
              onMouseEnter={this._handleMouse_onExpand}
              onMouseLeave={this._handleMouse_onExpand}>
              {this.props.i18nUIString.catalog["descript_Unit_BroadList"][1]}
              {' '}
            </span>
          }
          {
            (this.state.usersList.length > 0) &&
            <span
              className={classnames(styles.spanBlock)}>
              {this.props.i18nUIString.catalog["descript_Unit_BroadList"][0]}</span>
          }
        </div>
        {
          this.state.modalAll &&
          <div
            className={classnames(styles.comSum_boxModal)}>
            <div
              className={classnames(styles.comSum_boxModalClose)}
              onMouseEnter={this._handleMouse_onClose}
              onMouseLeave={this._handleMouse_onClose}>
              <span
                className={classnames(styles.comSum_spanClose)}
                style={this.state.onClose? {color: '#FAFAFA'}:{color: '#6e6e6e'}}
                onClick={this._handleClick_list_toggle}>
                {" ╳ "}
              </span>
            </div>
            {this._render_broadList()}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SumBroadList));
