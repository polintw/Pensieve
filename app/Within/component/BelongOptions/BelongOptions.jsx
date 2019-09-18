import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

const optionItem = (nodeId, self)=>{
  return (
    <div
      key={"key_Belong_options_"+index}
      nodeid={nodeId}
      onClick={(e)=>{e.stopPropagation();e.preventDefault(); self._set_choice(e.currentTarget.attributes.nodeid.value);}}>
      <span>
        {self.props.nounsBasic[nodeId].name}
      </span>
    </div>
  )
}

class BelongOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      choice: null, //record the chosen node
      options: []
    };
    this._render_Options = this._render_Options.bind(this);
    this._set_choice = (choice)=> this.setState({choice: choice});
    //_axios post input to db
    this.style={

    }
  }

  //_axios post, announce success to parent if no error

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    //_axios get options from db
  }

  componentWillUnmount() {

  }

  _render_Options(){
    this.state.options.map((nodeId, index)=>{
      return optionItem(nodeId, this);
    })
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongOptions)}>
        {this._render_Options()}
        //Options
        //node search, use editing modal
        {
          this.state.choice &&

          //warning modal, on dark bg, asking type
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongOptions));
