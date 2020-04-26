import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
    LinkSignUp,
} from '../../Sign/components/SigninForm/SigninFormComps.jsx';
import {
    LinkSignIn
} from '../../Sign/components/SignupCom/SignupFormComps.jsx';
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';
import {
    handleNounsList,
    handleUsersList,
} from "../../redux/actions/general.js";
import {
    cancelErr,
    uncertainErr
} from "../../utils/errHandlers.js";

class InvitationFellow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        axios: false,
        sender: null,
        node: null
    };
    this._axios_GET_InvitationFellow = this._axios_GET_InvitationFellow.bind(this);

}

  componentDidMount() {
      const self = this;
      this.setState({ axios: true });

      this._axios_GET_InvitationFellow()
      .then((resObj)=>{
          self.props._submit_NounsList_new(resObj.main.nounsList);
          self.props._submit_UsersList_new(resObj.main.usersList);
          self.setState({ 
              axios: false,
              sender: resObj.main.usersList[0],
              node: resObj.main.nounsList[0]
            });
          
    })
    .catch(function(thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
            cancelErr(thrown);
        } else {
            let message = uncertainErr(thrown);
            if (message) alert(message);
        }
    });
    }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <div
          className={styles.boxLogo}>
          <SvgLogo/>
        </div>
        <div
          className={classnames(styles.fontInput)}>

          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][0]}</p>

        </div>
        <LinkSignUp {...this.props} />
        <LinkSignIn {...this.props}/>
      </div>
    )
  }

    _axios_GET_InvitationFellow() {
        let params = new URLSearchParams(this.props.location.search); //we need value in URL query
        let invitation = !!params.invitation ? params.get('invitation') : false;
        if(!invitation) {throw new Error({message: 'You do not have the invitation.'});return;};

        axios({
            method: 'get',
            url: '/router/general/invitation/fellows',
            headers: {
                'charset': 'utf-8',
                'token': window.localStorage['token']
            },
            cancelToken: this.axiosSource.token,
            params: { invitingKey: invitation },
        })
            .then(function (res) {
                let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
                return resObj;
            }).catch(function (thrown) {
                throw thrown;
            });
    }

}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
      _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
      _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitationFellow);
