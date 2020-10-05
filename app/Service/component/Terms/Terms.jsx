import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
const {
  domain
} = require('../../../../config/services.js');

class Terms extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refCom = React.createRef();
    this.refScroll = React.createRef();
    this.style={

    }
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    if (this.refCom.scrollTop != 0) {
      window.scrollTo(0, 0)
    }
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        ref={this.refCom}
        className={styles.comTerms}>
        <div
          ref={this.refScroll}
          className={classnames(styles.boxScroll, styles.fontScroll)}>
          <h2>{"Terms of Services"}</h2>
          <section>
            <p>{"Hi, welcome to Cornerth. !"}</p>
          </section>
          <section>
            <p>{ domain.name +" enable you to post articles with graphic items on this weblog to share something interesting related to the corner you concern about, and we would love for you to use it. "+ domain.name + "’s basic service is free, and are provided by Cornerth., Inc."}</p>
          </section>
          <section>
            <p>{"These Terms govern your access to and use of " + domain.name+ ". These Terms also govern visitors’ access to and use of " + domain.name+ "."}</p>
          </section>
          <section>
            <p>{"Please read the Agreement carefully before accessing or using our Services. By accessing or using any part of our Services, you agree to become bound by the Agreement. If you do not agree to all the terms of the Agreement, you may not access or use our Services."}</p>
          </section>
          <section>
            <ol>
              <li>
                <h4>{"Your Account"}</h4>
                <p>{"Where use of our Services requires an account. You agree to provide us with complete and accurate information about yourself when you register for an account. You will be solely responsible and liable for any activity that occurs under your username."}</p>
                <p>{"You are responsible for keeping your account information up-to-date and for keeping your password secure. Please not share your password and provide access to your account to anyone else."}</p>
              </li>
              <li>
                <h4>{"Minimum Age Requirements"}</h4>
                <p>{"Our Services are not directed provide for children. Access to and use of our Services is only for those over the age of 13 (or 16 in the European Union). If you are younger than this, you may not allowed to register for or use our Services. Anyone who registers as a user or provides their personal information to our Services as if represents that they are already 13 years of age or older (or 16 years or older in the European Union)."}</p>
              </li>
              <li>
                <h4>{"Responsibility of  Users and Visitors"}</h4>
                <p>{"We have not reviewed, and cannot review all of the content (such as, but not limited to, text, graphic items , or other materials) posted to "+ domain.name +" by users or anyone else.  And we are not responsible for any use or effects of such content."}</p>
                <p>{"Which means (For example):"}</p>
                <ul>
                  <li>{"We do not endorse or represent that any content is accurate, useful, or non-harmful. The content could be offensive, indecent, or objectionable."}</li>
                  <li>{"The content may violate or infringe the privacy, publicity rights, intellectual property rights, or other proprietary rights of third parties. (In such case, please submit copyright complaints to us.)"}</li>
                  <li>{"You are entirely responsible for the content you post on " + domain.name+ " and any harm resulting from."}</li>
                  <li>{"We disclaim any responsibility for any harm resulting from anyone’s use, or downloading of the content on our services."}</li>
                  <li>{"We are not a party to any communications, interactions, or disputes between you and the other provider of any content. We will have no responsibility or liability for that, also."}</li>
                </ul>
              </li>
              <li>
                <h4>{"Fees and Renewal"}</h4>
                <p>{"Our services are free for provide. Yet we may change our fees at any time, or start charging fees for services that were previously free. We will sent advance notice of the fee changes."}</p>
              </li>
              <li>
                <h4>{"General Representation and Warranty"}</h4>
                <p>{"You represent and warrant that your use of our Services:"}</p>
                <ul>
                  <li>{"Will be in strict accordance with these Terms;"}</li>
                  <li>{"Will comply with all applicable laws and regulations (including, without limitation, all applicable laws regarding online conduct and acceptable content, privacy, data protection, and the transmission of technical data exported from the United States or the country in which you reside);"}</li>
                  <li>{"Will not use the Services for any unlawful purposes, to publish illegal content, or in furtherance of illegal activities;"}</li>
                  <li>{"Will not infringe or misappropriate the intellectual property rights of any third party;"}</li>
                  <li>{"Will not post any content inappropriate (Once you post some kind of this content, we have to right to remove it without advance notify. )."}</li>
                </ul>
              </li>
              <li>
                <h4>{"Intellectual Property"}</h4>
                <p>{"The content  you post, including the text and graphic items, may be protected by intellectual property laws. We guarantee you own the fully intellectual property rights according to the related law. But we need your authorization to use this content legally for providing and improving our services. "}</p>
                <p>{"Specifically, once you post an article on "+ domain.name+ ", we grant the permission to store, copy, and share the content through Hyperlink with others. This permission will terminate if you delete such content."}</p>
              </li>
              <li>
                <h4>{"Copyright Infringement"}</h4>
                <p>{"If you believe that material located on " + domain.name+ " violates your copyright, please notify us. We will respond to all such notices, including as required or appropriate by removing the infringing material or disabling all links to the infringing material according to Digital Millennium Copyright Act (“DMCA”) ."}</p>
              </li>
              <li>
                <h4>{"Amendment"}</h4>
                <p>{"We are constantly updating our services, which means that sometimes we have to change the legal terms under which our Services are offered."}</p>
              </li>
            </ol>
          </section>
          <div
            className={styles.boxFooter}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Terms));
