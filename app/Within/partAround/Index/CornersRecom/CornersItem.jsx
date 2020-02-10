import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesMain from "../styles.module.css";

/*
static data deisgned for prototype
*/
const temp_nodesCount = ["37", "5", "29", "19", "10", "3"]

class CornersItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){

    return (
      <div
        className={classnames(styles.boxDepend)}>
        <Link
          to={"/cosmic/nodes/"+this.props.nodeId}
          className={classnames('plainLinkButton', styles.boxNode)}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames(styles.spanNode, stylesMain.fontCorner)}>
            {
              this.state.onNode &&
              <span style={{
                  width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {this.props.nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[this.props.nodeId].name) : (
                null
            )}
          </div>
        </Link>
        <div
          className={classnames(styles.boxCount)}>
          <div style={{display: 'inline-flex', flexDirection: 'column'}}>
            <span
              className={classnames(styles.spanType, stylesMain.fontType)}>
              {this.props.i18nUIString.catalog['category__Belong_usersCount'][0]}
            </span>
            <span
              className={classnames(styles.spanType, stylesMain.fontType)}>
              {this.props.i18nUIString.catalog['category__Belong_usersCount'][1]}
            </span>
          </div>
          <span
            className={classnames(styles.spanType, styles.fontCount)}>
            {
              //temp method, modified after permanent method est.
              temp_nodesCount[this.props.index]
            }
          </span>
        </div>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comCornersItem)}>
        {this._render_nodeLink()}
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
)(CornersItem));
