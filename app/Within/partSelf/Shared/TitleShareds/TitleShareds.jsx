import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavShareds from './NavShareds.jsx';

class TitleShareds extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPrimerLine: false
    };
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let pathProjectify = this.props.location.pathname.includes('/pathProject');
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = false;

    return (
      <div className={styles.comTitleShareds}>
        <div
          className={classnames(styles.boxUpperRow)}>
          <span
            className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
            {this.props.i18nUIString.catalog['title_Published']}
          </span>
          <div style={{marginLeft: '3px'}}>
            {
              (!!this.props.userInfo.pathName && pathProjectify) &&
              <div
                className={classnames("fontContentPlain", "colorGrey")}>
                <span style={{cursor: 'default'}}>{"/ "}</span>
                <a
                  href={'/cosmic/explore/path/'+ this.props.userInfo.pathName}
                  className={classnames('plainLinkButton', "colorAssistOcean")}
                  style={{
                    display: 'inline-block',
                    textDecoration: this.state.onPrimerLine? "underline": "none"
                  }}
                  onMouseEnter={this._handleEnter_primerLine}
                  onMouseLeave={this._handleLeave_primerLine}>
                  <span>
                    {this.props.userInfo.pathProject}
                  </span>
                </a>
              </div>
            }
          </div>
        </div>
        {
          !!this.props.userInfo.pathName &&
          <NavShareds {...this.props}/>
        }
      </div>
    )
  }

  _handleEnter_primerLine(e){
    this.setState({onPrimerLine: true})
  }

  _handleLeave_primerLine(e){
    this.setState({onPrimerLine: false})
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
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
)(TitleShareds));
