import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

function SubNodes(props){
  return (
    <Link
      to="/cosmic/explore/nodes"
      className={classnames('plainLinkButton', styles.boxSubtitle)}>
      <span
        className={classnames(styles.fontSubtitle)}>
        {'Nodes'}
      </span>
    </Link>
  )
}


class ExpSubtitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <Switch>
          <Route path={this.props.match.path+"/nodes"} component={SubNodes}/>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(ExpSubtitle));
