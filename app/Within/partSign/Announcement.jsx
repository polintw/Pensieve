import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
    cancelErr,
    uncertainErr
} from "../../utils/errHandlers.js";

class Announcement extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Announcement = this._render_Announcement.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_ContentArr(contentArr){
    const content = contentArr.map((sentence, index)=>{
      return (
        <p
          key ={"key_announcement_content_"+index}
          className={classnames("fontSubtitle_h5", "colorSignBlack")}>
          {sentence}
        </p>
      )
    });
    return content;
  }

  _render_Announcement(){
    return (
      <div
        className={classnames(styles.comAnnouncement)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames("fontTitle", "colorStandard")}>
            {this.props.i18nUIString.catalog["title_Announcement"]}
          </span>
          <span
            className={classnames("fontTitle", "colorStandard")}
            style={{marginLeft: '1rem'}}>
            {toNewsCCServer_title}
          </span>
        </div>
        {this._render_ContentArr(toNewsCCServer_content)}
      </div>
    )
  }

  render(){
    return(
      <div>
        {
          this._render_Announcement()
        }
      </div>
    )
  }
}

const toNewsCCServer_title = "| To News as Malicious Domain"
const toNewsCCServer_content = [
  "Thank you for visiting our platform. I am the main developer and administrator of this site, cornerth.com.",
  "This announcment is because, as you may heard, our domain was rencently reported unsafe by Ministry of Justice Investigation Bureau, Taiwan, as the server our domain on was used as a C&C(control & command server) by hacking groups in a series of cyber attack. As soon as we became aware of this situation, we took immediate actions to manage and respond to the issue, holding our service and investigating any unauthorized access or process. We nofitified and now cooperated with the related authority to help them clarifying the related cyber attack and the way our server was used by the hacking groups. As the main developer, I personally also engaged several expert for advice from cyber security, fixing any possible weak point among our service.",
  "As our current investigation, there is no evidence that personal information of any nature has been accessed or misused. But we decided to suspend the platform for a week before further steps about security were well established.",
  "We are really sorry for what has happened.",
  "We are a small team working on this project since last year. As a start-up project, Cornerth. is a platform aim to give people an easy way to",
  "we tried to build our own server on a home network based machine.",
  "25 Aug. 2020",
  "Cornerth. team"
];


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Announcement);
