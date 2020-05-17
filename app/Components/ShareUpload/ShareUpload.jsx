import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../Unit/Editing/CreateShare.jsx';
import SvgCreateDashed from '../Svg/SvgCreateDashed.jsx';

class ShareUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      onCreate: false,

    };
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comShareUpload)}>
        <div
          className={classnames(styles.boxSvgBg)}
          onMouseEnter={this._handleMouseOn_Create}
          onMouseLeave={this._handleMouseOn_Create}>
          <SvgCreateDashed/>
        </div>
        <CreateShare
          forceCreate={this.state.editingOpen}
          _submit_Share_New={this.props._submit_Share_New}
          _refer_von_Create={this.props._refer_von_Create}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareUpload));
