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
      usersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_broadList = this._render_broadList.bind(this);
    this._axios_get_listBroad = this._axios_get_listBroad.bind(this);
    this._handleEnter_listItem = this._handleEnter_listItem.bind(this);
    this._handleLeave_listItem = this._handleLeave_listItem.bind(this);
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

  _handleClick_list_toggle(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{
      return {
        modalAll: prevState ? false : true
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
        <Link
          key={"key_BroadList_item_"+index}
          user={userId}
          to= {userLink}
          className={classnames(
            'plainLinkButton',
            styles.comSum_boxListItem,
            styles.comSum_fontListItem
          )}
          onMouseEnter={this._handleEnter_listItem}
          onMouseLeave={this._handleLeave_listItem}>
          {
            (userId in this.props.usersBasic) &&
            <AccountPlate
              size={'layer'}
              accountFisrtName={this.props.usersBasic[userId].firstName}
              accountLastName={this.props.usersBasic[userId].lastName}
              styleFirst={{fontWeight: '400', color: :(this.state.onListItem == userId)? "rgb(250, 250, 250)": "#FAFAFA"}}
              styleLast={{fontWeight: '300', color: (this.state.onListItem == userId)? 'rgb(64, 133, 160)': "#fafafa"}}/>
          }
        </Link>
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
          className={classnames(styles.comSum_boxDescript, styles.comSum_fontDescript)}
          onClick={this._handleClick_list_toggle}>
          {
            (this.state.usersList.length > 4) &&
            <div style={{display: 'inline'}}>
              <span>{this.props.i18nUIString.catalog["descript_Unit_BroadList"][1][0]}</span>
              <a
                className={classnames(styles.comSum_fontExpand)}
                style={{textDecoration: 'none'}}>
                {this.props.i18nUIString.catalog["descript_Unit_BroadList"][1][1]}</a>
            </div>
          }
          <span>{this.props.i18nUIString.catalog["descript_Unit_BroadList"][0]}</span>
        </div>
        {
          this.state.modalAll &&
          <div>
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
