import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  handleUsersList
} from '../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {
  comExploreUsers: {
    width: '907px',
    position: 'absolute',
    left: '51%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
  boxUserBlocks: {
    height: '',
    minHeight: '36vh',
    padding: '3% 4%',
    margin: '0 0 2%',
    textAlign: 'center'
  },
  boxRendomItem: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 5%',
    margin: '4% 2%',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  fontListItem: {
    fontSize: '1.32rem',
    letterSpacing: '0.12rem',
  }
}

class UsersBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this._render_exploreList_users = this._render_exploreList_users.bind(this);
  }

  _render_exploreList_users(){
    let list = this.props.usersList.map((userId, index)=>{
      //claim path as a independent var to check if it is the id of user self
      let path = "/cosmic/users/"+userId+"/accumulated";
      return (
        <div
          key={"key_Explore_List_user_"+index}
          style={styleMiddle.boxRendomItem}>
          <Link
            to={path}
            className={'plainLinkButton'}>
            <span
              style={styleMiddle.fontListItem}>
              {userId in this.props.usersBasic ? this.props.usersBasic[userId].account:null}
            </span>
          </Link>
        </div>
      )
    })
    //for now, the author was fixed at the first of the second block
    if(this.props.usersList[0] == this.props.userInfo.id) list[0] = (
      <div
        key={"key_Explore_List_user_"+"0"}
        style={styleMiddle.boxRendomItem}>
        <a
          href={'/user/screen'}
          className={'plainLinkButton'}>
          <span
            style={styleMiddle.fontListItem}>
            {this.props.userInfo.account}
          </span>
        </a>
      </div>
    );

    return list;
  }

  render(){
    return (
      <div>
        {this._render_exploreList_users()}
      </div>
    )
  }
}


class ExploreUsers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      listUsers: [],
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_users_explore = this._axios_users_explore.bind(this);
    this._render_users_Block = this._render_users_Block.bind(this);
    this.style={

    }
  }

  _axios_users_explore(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/explore/users',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      self.setState({axios: false});

      let resObj = JSON.parse(res.data);
      self.props._submit_UsersList_new(resObj.main.usersListPlain);
      //now we remove user itself first, add back later to a specific place
      let selfIndex = resObj.main.usersListPlain.indexOf(self.props.userInfo.id);
      if(selfIndex > (-1)) resObj.main.usersListPlain.splice(selfIndex, 1);
      //for convenience when rendering, limit first block to less than 8
      let [firstEight, afterEight]=[[],[]];
      if(resObj.main.usersListPlain.length>8) {
        firstEight = resObj.main.usersListPlain.slice(0, 8);
        afterEight = resObj.main.usersListPlain.slice(8);
      }else firstEight=resObj.main.usersListPlain;
      //add the user self back
      //in the future, mind this process, for it's just a temp method
      //would cause problem if there are more than one request for all
      afterEight.unshift(self.props.userInfo.id);
      self.setState((prevState, props)=>{
        prevState.listUsers.push(firstEight);
        prevState.listUsers.push(afterEight);
        return {
          listUsers: prevState.listUsers
        }
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

  _render_users_Block(){
    let list = this.state.listUsers.map((usersBlock, index)=>{
      return (
        <UsersBlock
          key={"key_Explore_Block_users_"+index}
          usersList={usersBlock}
          usersBasic={this.props.usersBasic}
          userInfo={this.props.userInfo}/>
      ) // both usersBasic and userInfo is saved in reducer,
        // so should be called directly if the UsersBlock was imported from a independent file
    });

    //then insert the reserved area for nav
    list.splice(1,0, (
      <div
        key={"key_Explore_users_navReserved"}
        style={{width: '100%', height: '11rem',position: 'relative'}}/>))
    //add a footer as ending
    list.push(
      <div
        key={"key_Explore_users_footer"}
        style={{height: '81px', position: 'relative'}}></div>)

    return list;
  }

  componentDidMount() {
    //load current users list
    this._axios_users_explore();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={styleMiddle.comExploreUsers}>
        <div
          className={'boxRelativeFull'}
          style={styleMiddle.boxUserBlocks}>
          {this._render_users_Block()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic,
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
)(ExploreUsers));
