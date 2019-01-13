import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import querystring from 'query-string';
import cxBind from 'classnames/bind';
import CosmicSelected from './CosmicSelected.jsx';

export default class CosmicNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      userQueried: this.props.match.params.id
    };
    this.axiosSource = axios.CancelToken.source();
    this.style={
      withinCom_CosmicNoun_: {
        width: '75%',
        position: 'absolute',
        top: '2vh',
        left: '12%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicNoun_selected_: {
        width: '100%',
        minHeight: '64vh',
        position: 'absolute',
        top: '44vh',
        left: '0%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicNoun_cover_: {
        width: '100%',
        height: '48vh',
        position: 'absolute',
        top: '2vh',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicNoun_}>
        <div
          style={this.style.withinCom_CosmicNoun_cover_}>

        </div>
        <div
          style={this.style.withinCom_CosmicNoun_selected_}>
          <Route path={this.props.match.path} render={(props)=> <CosmicSelected {...props} urlParam={"/router/cosmic/pick/noun/regular"} urlQuery={"?id="+this.state.userQueried}/>}/>
        </div>
      </div>
    )
  }
}
