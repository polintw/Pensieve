import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Nodes = this._render_Nodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Nodes(){
    return(
      <div>
        <span>
          {"Taipei City"}
        </span>
        <span>
          {"New Taipei City"}
        </span>
        <span>
          {"Taoyuan City"}
        </span>
        <span>
          {"Keelung City"}
        </span>
      </div>
    )
  }

  render(){
    return (
      <div className={styles.comNodesFilter}>
        {this._render_Nodes()}
      </div>
    )
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesFilter));
