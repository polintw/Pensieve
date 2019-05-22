import React from 'react';
import { connect } from "react-redux";
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import {updateUsersBasic} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

const styleMiddle = {
  boxInspired: {
    position: 'relative'
  },
  svgBulbPlain: {
    strokeWidth:'10px',
    stroke: '#f7f4bc',
    fill: 'transparent'
  }
}

class AuthorInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      listify: false,
      listInspired: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_inspired_list = this._axios_inspired_list.bind(this);
    this._render_inspiredList = this._render_inspiredList.bind(this);
    this._handleClick_authorInspired = this._handleClick_authorInspired.bind(this);
    this.style = {
      Com_AuthorInspired_bulb:{
        display: 'inline-block',
        width: '17px',
        position: 'relative',
        margin: '0 4%',
      }
    };
  }

  _handleClick_authorInspired(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.state.listify){this.setState({listify: false}); return;};
    this._axios_inspired_list();
    this.setState({listify: true});
  }

  _axios_inspired_list(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/units/'+self.props.unitCurrent.unitId+'/author/inspired?markId='+self.props.markKey,
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      let resObj = JSON.parse(res.data);
      self.props._update_UsersBasic(resObj.main.usersBasic);
      self.setState({
        axios: false,
        listInspired: resObj.main.usersList
      });
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _render_inspiredList(){
    let listDOM = this.state.listInspired.map((id, index)=>{
      return (
        <div
          key={'key_authorBlock_inspiredList_'+index}>
          <span>{this.props.usersBasic[id].account}</span>
        </div>
      )
    })
    //user id from list, get account, firstName, or lastName from userBasic in reducer
    return listDOM;
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div style={styleMiddle.boxInspired}>
        <div
          style={Object.assign({},
            this.style.Com_AuthorInspired_bulb,
            styleMiddle.svgBulbPlain)}>
          <SvgBulbPlainHalf/>
        </div>
        <span
          onClick={this._handleClick_authorInspired}
          style={{cursor: 'pointer'}}>
          {this.props.unitCurrent.marksInteraction[this.props.markKey].inspired+"/"}</span>
        {
          this.state.listify &&
          <div>
            {this._render_inspiredList()}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    usersBasic: state.usersBasic,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting,
    unitAxiosInspire: state.unitAxiosInspire
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _update_UsersBasic: (obj)=>{dispatch(updateUsersBasic(obj));}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorInspired);
