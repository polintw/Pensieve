import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../stylesFont.module.css";

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };

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
        className={classnames(styles.boxTitle)}
        style={{textAlign: 'right'}}>
        <Link
          to={"/"}
          className={classnames('plainLinkButton')}
          onClick={(e)=>{ if(this.props.location.pathname == '/') e.preventDefault(); }}>
          <span
            className={classnames(
              stylesFont.fontHint, stylesFont.weightBold,
              {
                [stylesFont.colorAssistGold]: (this.props.location.pathname == '/'),
                ["colorLightGrey"]: !(this.props.location.pathname == '/')
              })}>
            {this.props.i18nUIString.catalog["link_Fellows"]}</span>
        </Link>
        <Link
          to={"/gathering"}
          className={classnames('plainLinkButton')}
          onClick={(e)=>{ if(this.props.location.pathname.includes('gathering')) e.preventDefault(); }}>
          <span
            className={classnames(
              stylesFont.fontHint, stylesFont.weightBold,
              {
                [stylesFont.colorAssistGold]: this.props.location.pathname.includes('gathering'),
                ["colorLightGrey"]: !this.props.location.pathname.includes('gathering')
              })}>
            {this.props.i18nUIString.catalog["title_FeedAssigned_"]}</span>
        </Link>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
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
)(NavFeed));
