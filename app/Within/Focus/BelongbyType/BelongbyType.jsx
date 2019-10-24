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

import CreateShare from '../../../Component/CreateShare.jsx';


class BelongbyType extends React.Component {
  constructor(props){
    super(props);
    this.state = {

      onNode: false,
    };
    this._render_type = this._render_type.bind(this);
    this._render_type_used = this._render_type_used.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});

    this.style={

    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/unit?theater&unitId='+dataObj.unitId);
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    //determine the id of current node, but Notice
    //the value of key 'used' is an array, to recognize it
    //we need to follow the length of the whole Belong list --- currently there are 4 tiems before the 1sr 'used'
    const nodeId = (this.props.type != 'used') ? this.props.typeObj[this.props.type] : this.props.typeObj['used'][(this.props.listIndex-4)];

    return (
      <div>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton', styles.boxNode)}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames(styles.spanNode)}>
            {
              this.state.onNode &&
              <span style={{
                  width: '72%', position: 'absolute', bottom: '-11%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {nodeId in this.props.nounsBasic ? (
              self.props.nounsBasic[nodeId].name) : (
                null
            )}
          </div>
        </Link>
        <div>
          <span>{"way to "}</span>
          <span>
            {
              !!(nodeId in this.props.nodesSharedCount) &&
              this.props.nodesSharedCount[nodeId]
            }</span>
        </div>
      </div>
    )
  }

  _render_type(){
    return (
      <div>
        <span>
          {this.props.type}</span>
      </div>
    )
  }

  _render_type_used(){
    //'used' display is different, so er render it seperately
    //first, check if the data ready
    let nodeIfy = !!(this.props.typeObj['used']) ? true: false;
    //if the 'used' exist, the value of it is an array, to recognize it
    //we need to follow the length of the whole Belong list --- currently there are 4 tiems before the 1sr 'used'
    if(nodeIfy) nodeIfy = !!(this.props.typeObj['used'][(this.props.listIndex-4)]);

    return (
      <div>
        <span>
          {this.props.type}</span>
        {
          !nodeIfy &&
          <div
            className={classnames(styles.boxCreate)}
            onMouseEnter={this._handleMouseOn_Create}
            onMouseLeave={this._handleMouseOn_Create}>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
        }

      </div>
    )

  }

  render(){

    return(
      <div
        className={classnames(styles.comBelongByType)}>
        {(this.props.type=="used") ? this._render_type_used() : this._render_type()}
        {
          !!(this.props.type in this.props.typeObj) &&
          this._render_nodeLink()
        }
        {

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
)(BelongbyType));
