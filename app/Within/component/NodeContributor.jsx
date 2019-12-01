import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {
  comNodeContributor: {

  },
  boxBlocks: {
    width: '100%',
    minHeight: '5rem',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '2rem 0px 0px'
  },
  footer: {
    width: '100%',
    height: '5rem',
    position: 'relative',
    boxSizing: 'border-box'
  },
  fontPlaceholder: {
    fontSize: '1.45rem',
    fontWeight: '700',
    letterSpacing: '0.1rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: '#AAAAAA'
  },
  boxBlockItem: {
    display: 'inline-block',
    minWidth: '28%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 3%',
    margin: '3% 2%',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  fontListItem: {
    fontSize: '1.54rem',
    letterSpacing: '0.08rem',
  }
}

class UsersBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this._render_Contributors = this._render_Contributors.bind(this);
  }

  _render_Contributors(){
    let list = this.props.usersList.map((userId, index)=>{
      //check author in the list or not
      if(userId == this.props.userInfo.id) return (
        <div
          key={"key_Explore_List_user_"+index}
          style={styleMiddle.boxBlockItem}>
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
      //claim path as a independent var to check if it is the id of user self
      let path = "/cosmic/users/"+userId+"/accumulated";
      return (
        <div
          key={"key_Explore_List_user_"+index}
          style={styleMiddle.boxBlockItem}>
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

    return list;
  }

  render(){
    return (
      <div>
        {this._render_Contributors()}
      </div>
    )
  }
}


class NodeContributor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      listUsers: [],
      //listUsers is a arr composed of multiple unitsList(also an arr)
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_users_Block = this._render_users_Block.bind(this);
    this._axios_Nodes_Contribute = this._axios_Nodes_Contribute.bind(this);
    this.style={

    }
  }

  _axios_Nodes_Contribute(){
    const self = this;
    this.setState({axios: true});

    //now get the Units of this noun from the attribution in database
    axios({
      method: 'get',
      url: '/router/nouns/'+this.nounId+'/attribution',
      params: {require: "contributors"},
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      self.setState({axios: false});

      let resObj = JSON.parse(res.data);
      self.props._submit_UsersList_new(resObj.main.usersListPlain);
      self.setState((prevState, props)=>{
        //we don't push anything and keep it as previous,
        //bexuase we need to let the render check if there is any id for this noun or not.
        if(resObj.main.usersListPlain.length>0) prevState.listUsers.push(resObj.main.usersListPlain);
        return({
          listUsers: prevState.listUsers, //maybe this is not a good way, modifying the prevState directy
        });
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
    if(!this.state.listUsers[0]) return(
      <div
        style={Object.assign({}, styleMiddle.fontPlaceholder, {boxSizing: 'border-box',margin: '13% 0'})}>
        {"waiting for someone, perhaps that's just you! "}
      </div>
    );

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

    return list;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump from noun to noun, using the same component this one
    //so we check if the nounId has changed
    this.nounId = this.props.match.params.nounId;
    if(this.nounId !== prevProps.match.params.nounId){
      //load Units tagged to this noun
      this._axios_Nodes_Contribute();
    };
  }

  componentDidMount() {
    //load Units tagged to this noun
    this.nounId = this.props.match.params.nounId;
    this._axios_Nodes_Contribute();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={'boxRelativeFull'}
        style={styleMiddle.comNodeContributor}>
        <div
          style={styleMiddle.boxBlocks}>
          {this._render_users_Block()}
        </div>
        <div style={styleMiddle.footer}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic,
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
)(NodeContributor));
