import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const generalStyle = {
  spanNameRegular: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    fontSize: '1.45rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
  },
}

class Regular extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <span style={generalStyle.spanNameRegular}>
        {this.props.userInfo.firstName + " " + this.props.userInfo.lastName}
      </span>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

export const NameRegular = withRouter(reduxConnection(Regular));

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
    let classSpan = this._set_classByProps();

    return(
      <div
        style={{display: 'inline-block'}}>
        <span
          className={classSpan}>
          {this.props.accountFisrtName+" "}
        </span>
        <span
          className={classSpan}>
          {this.props.accountLastName}
        </span>
      </div>
    )
  }
}

export const AccountPlate = withRouter(reduxConnection(Palette));
