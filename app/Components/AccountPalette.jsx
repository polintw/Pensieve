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
      case 'regular':
        return 'spanNameRegular'
        break;
      case 'medium':
        return 'spanNameMedium'
        break;
      case 'title':
        return 'spanNameTitle'
        break;
      case 'large':
        return 'spanNameLarge'
        break;
      case 'layer':
        return 'spanNameLayer'
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
    if(!firstName) firstName = !!this.props.userId ? (this.props.userId in this.props.usersBasic) ? (this.props.usersBasic[this.props.userId].firstName+" ") :　null : null;
    if(!lastName) lastName = !!this.props.userId ? (this.props.userId in this.props.usersBasic) ? this.props.usersBasic[this.props.userId].lastName :　null : null;

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
    usersBasic: state.usersBasic
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

const AccountPalette = withRouter(reduxConnection(Palette));

export default AccountPalette;
