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

const styleMiddle = {
  comUserWindow: {

  },
  boxTitle: {

  },
  boxNav: {

  },
  boxName: {

  },
  fontName: {

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
            <Link>
              {'accumulated'}
            </Link>
            <Link>
              {'sheet'}
            </Link>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxName, styleMiddle.fontName)}>
            {this.userId in this.props.usersBasic? (
              this.props.usersBasic[this.userId].name
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

export default withRouter(connect(
  mapStateToProps,
  null
)(UserWindow));
