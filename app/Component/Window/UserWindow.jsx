import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import Accumulated from './Accumulated.jsx';
import Sheet from './Sheet.jsx';
import {
  handleUsersList
} from "../../redux/actions/general.js";
import {NameLarge} from '../AccountPlate.jsx';

const styleMiddle = {
  comUserWindow: {

  },
  boxTitle: {

  },
  boxNav: {

  },
  boxName: {

  }
}

class UserWindow extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this.props._submit_UsersList_new([this.props.windowId]);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        style={styleMiddle.comUserWindow}>
        <div
          style={styleMiddle.boxTitle}>
          <div
            style={styleMiddle.boxNav}>
            <Link
              to={this.props.match.url+"/accumulated"}
              className={'plainLinkButton'}>
              {'accumulated'}
            </Link>
            <Link
              to={this.props.match.url+"/sheet"}
              className={'plainLinkButton'}>
              {'sheet'}
            </Link>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxName)}>
            {this.props.windowId in this.props.usersBasic? (
              <NameLarge
                firstName={this.props.usersBasic[this.props.windowId].firstName}
                lastName={this.props.usersBasic[this.props.windowId].lastName}/>
            ): (
              null
            )}
          </div>
        </div>
        <Switch>
          <Route path={this.props.match.path+"/accumulated"} render={(props)=> <Accumulated {...props}/>}/>
          <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic
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
)(UserWindow));
