import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class LinkExplore extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onExplore: false,
    };
    this._handleLeave_linkExplore = this._handleLeave_linkExplore.bind(this);
    this._handleEnter_linkExplore = this._handleEnter_linkExplore.bind(this);
    this.style={

    }
  }

  _handleEnter_linkExplore(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onExplore: true
    })
  }

  _handleLeave_linkExplore(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onExplore: false
    })
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
        className={classnames(styles.comExplore)}>

        <Link
          to="/cosmic/explore/nodes"
          className={classnames('plainLinkButton', styles.boxExplore, styles.fontExplore)}
          onMouseEnter={this._handleEnter_linkExplore}
          onMouseLeave={this._handleLeave_linkExplore}>
          <span>
            {'explore'}</span>
          <span style={{
              width: '60%', marginTop: '10%',
              borderBottom: this.state.onExplore? 'solid 1px #ff7a5f': 'solid 1px rgb(64, 133, 160)'
            }}/>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(LinkExplore);
