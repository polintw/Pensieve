import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

class Palette extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_classByProps = this._set_classByProps.bind(this);
  }

  _set_classByProps(){
    switch (this.props.size) {
      case 'layer':
        return 'spanNameLayer'
        break;
      case 'content':
        return 'spanNameContent'
        break;
      case 'regular':
        return 'spanNameRegular'
        break;
      case 'regularBold':
        return 'spanNameRegularBold'
        break;
      default:
        return 'spanNameRegular'
    }
  }

  render(){
    let classSpan = this._set_classByProps(),
        propsStyle = [
          this.props.styleFirst ?　this.props.styleFirst: {},
          this.props.styleLast ? this.props.styleLast: {}
        ],
        firstName = !!this.props.accountFirstName? (this.props.accountFirstName+" ") : null,
        lastName = !!this.props.accountLastName? this.props.accountLastName : null;
    // now, there is a chance we are render a name of 'pathProject',
    // pathProject would only use firstName, no lastName
    let basicObjChoice = (this.props.authorIdentity == 'pathProject') ? 'pathsBasic' : 'usersBasic';
    if(!firstName && !!this.props.userId){
      if(this.props.userId in this.props[basicObjChoice]){
        firstName = (basicObjChoice == 'usersBasic') ? (this.props[basicObjChoice][this.props.userId].firstName+" ") : (this.props[basicObjChoice][this.props.userId].pathProject+" ") ;
      }
    };
    if(!lastName && !!this.props.userId){
      if(basicObjChoice == 'usersBasic') lastName = (this.props.userId in this.props.usersBasic) ? this.props.usersBasic[this.props.userId].lastName :　null;
    };

    return(
      <div
        style={{display: 'inline-block'}}>
        <span
          className={classnames(classSpan, 'spanNameFirstName')}
          style={propsStyle[0]}>
          {firstName}
        </span>
        <span
          className={classSpan}
          style={propsStyle[1]}>
          {lastName}
        </span>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    usersBasic: state.usersBasic,
    pathsBasic: state.pathsBasic
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

const AccountPalette = withRouter(reduxConnection(Palette));

export default AccountPalette;
