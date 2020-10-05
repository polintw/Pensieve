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

class Privacy extends React.Component {
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
        className={styles.comPrivacy}>
        <div
          ref={this.refScroll}
          className={classnames(styles.boxScroll, styles.fontScroll)}>
          <h2>{"Privacy Policy"}</h2>
          <section>
            <p>{"We critically concern about the user’s privacy. The following is our Privacy Policy:"}</p>
          </section>
          <section>
            <ol>
              <li>
                <h4>{"Information Collection"}</h4>
                <p>{"We only collect your personal information for reasons to do so. For instance, to provide and improve our services and to communicate with you. We collect information in the following ways:"}</p>
                <ol type="A">
                  <li>
                    <p>{"Basic Account Information:"}</p>
                    <p>{"The basic information we ask for when you set up your account."}</p>
                  </li>
                  <li>
                    <p>{"Log Information:"}</p>
                    <p>{"Like most online service providers, we collect information that web browsers, mobile devices, and servers typically make available, such as the browser type, IP address, unique device identifiers, language preference, referring site, the date and time of access, operating system, and mobile network information."}</p>
                  </li>
                  <li>
                    <p>{"Usage Information:"}</p>
                    <p>{"We collect the information about your usage of our Services."}</p>
                  </li>
                  <li>
                    <p>{"Location Information:"}</p>
                    <p>{"We may determine the approximate location of your device from your IP address. We collect and use this information for specifically purpose, such as calculating the number of visitors of certain geographic regions."}</p>
                  </li>
                </ol>
              </li>
              <li>
                <h4>{"Purposes for Using Information"}</h4>
                <p>{"We collect and use information about you as mentioned above for the  following purposes: "}</p>
                <ul>
                  <li>{"To provide our services. Such as setting up and maintenance of your account;"}</li>
                  <li>{"To further develop and improve our Services. For example, by adding new features our users may enjoy and for better use of our services; "}</li>
                  <li>{"To monitor and analyze trends and better understand how users interact with our Services, which helps us improve our services;"}</li>
                  <li>{"To measure, gauge, and improve the effectiveness of our advertising, and better understand users’ retention and attrition;"}</li>
                  <li>{"To prevent any problems with our Services, and protect the security of our Services; "}</li>
                  <li>{"To personalize your experience in using our Services."}</li>
                </ul>
                <p>{"We would not sell and provide your personal information to advertisers.  We would not share any directly identified information to advertisers also. "}</p>
                <p>{"However we may show ads to users who correspond to the kind of audience of advertisers, according to the factors of audience the advertisers provide."}</p>
              </li>
              <li>
                <h4>{"Legal Bases for Collecting and Using Information"}</h4>
                <p>{"A note here for those in the European Union. " + domain.name+ " complied to General Data Protection Regulation (“GDPR”) in information collection and using."}</p>
              </li>
              <li>
                <h4>{"Security"}</h4>
                <p>{"While no online service is 100% safe, we strive as much as possible to protect information security about you to against from unauthorized access, use, alteration, or destruction, and take reasonable measures."}</p>
              </li>
              <li>
                <h4>{"How to reach us"}</h4>
                <p>{"If you have further questions about our Privacy Policy, please contact us."}</p>
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
)(Privacy));
