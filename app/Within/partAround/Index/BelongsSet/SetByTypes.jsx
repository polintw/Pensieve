import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class SetByTypes extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_typesSubmit = this._render_typesSubmit.bind(this);
    this._handleClick_editByType = this._handleClick_editByType.bind(this);
  }

  _handleClick_editByType(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_searchModal(event.currentTarget.getAttribute('valuetype'));
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_typesSubmit(){
    let noRecTypes = this.props.belongTypes.filter((type, index)=>{
      return !(type in this.props.belongsByType) //return the type not yet set
    });
    let submitDOM = [];

    if(noRecTypes.length > 0){
      submitDOM = noRecTypes.map((type, index)=>{
        return (
          <div
            valuetype={type}
            onClick={this._handleClick_editByType}>
            {type}
          </div>
        )
      });
    }

    return submitDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelong)}>
        {this._render_typesSubmit()}

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SetByTypes));
