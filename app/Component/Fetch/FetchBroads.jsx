import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  setIndexLists
} from '../../redux/actions/cosmic.js';
import {
  handleUsersList,
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class FetchBroads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      usersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_GET_broadUsers = this._axios_GET_broadUsers.bind(this);
    this.style={

    }
  }

  _axios_GET_broadUsers(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/broad/'+this.props.unitId, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);
      //submit change to reducer
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.setState({
        axios: false,
        usersList: resObj.main.usersList
      });
    })
    .catch(function (thrown) {
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

  }

  componentDidMount() {
    this._axios_GET_broadUsers();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    // because we want to pass list to Block, we clone it to props.children
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, {
        broadsList: this.state.usersList
      })
    );

    return (
      <div>
        {childrenWithProps}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchBroads));
