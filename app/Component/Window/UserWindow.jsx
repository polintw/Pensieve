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
import {AccountPlate} from '../AccountPlate.jsx';

const styleMiddle = {
  comUserWindow: {
    height: '' //keep the height depend on content
  },
  boxTitle: {
    width: '100%',
    height: '9rem',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 0 3rem',
  },
  boxScroll: {
    height: '', //keep the height depend on content
  },
  boxNav: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box'
  },
  boxName: {
    position: 'absolute',
    left: '0',
    top: '2.7rem',
    boxSizing: 'border-box'
  },
  fontNav: {
    fontSize: "1.32rem",
    letterSpacing: "0.1rem",
    whiteSpace: "nowrap",
    color: "#333333"
  },
  spanNav: {
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    margin: '0.5rem',
    cursor: 'pointer'
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
        className={'boxRelativeFull'}
        style={styleMiddle.comUserWindow}>
        <div
          style={styleMiddle.boxTitle}>
          <div
            style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
            <Link
              to={this.props.match.url+"/sheet"}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'sheet'}</span>
            </Link>
            <Link
              to={this.props.match.url+"/accumulated"}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'accumulated'}</span>
            </Link>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxName)}>
            {this.props.windowId in this.props.usersBasic? (
              <AccountPlate
                size={'title'}
                accountFisrtName={this.props.usersBasic[this.props.windowId].firstName}
                accountLastName={this.props.usersBasic[this.props.windowId].lastName}/>
            ): (
              null
            )}
          </div>
        </div>
        <div
          className={'boxRelativeFull'}
          style={styleMiddle.boxScroll}>
          <Switch>
            <Route path={this.props.match.path+"/accumulated"} render={(props)=> <Accumulated {...props} {...this.props}/>}/>
            <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props} {...this.props}/>}/>
          </Switch>
        </div>
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
