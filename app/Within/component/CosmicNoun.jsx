import React from 'react';
import querystring from 'query-string';
import cxBind from 'classnames/bind';
import CosmicSelected from './CosmicSelected.jsx';

export default class CosmicNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      userQueried: null
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
    let urlQuery = querystring.parse(this.props.location.search); //should be contain in redux
    const self = this;
    this.setState((prevState, props)=>{
      return {userQueried: urlQuery.id}
    })
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
          {
            this.state.userQueried &&
            <CosmicSelected
              urlParam={"/router/cosmic/pick/noun/regular"}
              urlQuery={"?id="+this.state.userQueried}/>
          }
        </div>
      </div>
    )
  }
}
