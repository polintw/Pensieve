import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

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

export const AccountPlate = withRouter(reduxConnection(Palette));
