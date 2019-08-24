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
    display: 'flex',
    height: '100%',
    cursor: 'pointer'
  },
  boxInspiredList:{
    width: '144px',
    maxHeight: '810%',
    minHeight: '360%',
    position: 'absolute',
    bottom: '102%',
    right: '0',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0.056rem -0.16rem 0.21rem -0.06rem',
    overflow: 'auto'
  },
  boxListItem: {
    display: 'inline-block',
    width: '95%',
    height: '36px',
    boxSizing: 'border-box',
    margin: '2% 2%',
    borderBottom: '1px solid grey',
    padding: '2% 3%',
  },
  svgBulbPlain: {
    strokeWidth:'10px',
    stroke: '#d8c98c',
    fill: 'transparent'
  },
  spanCount: {
    whiteSpace: 'nowrap',
  },
  fontListItem: {
    fontSize: '1.28rem',
    fontWeight: '400',
    letterSpacing: '0',
    color: 'black'
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
        width: '17px',
        marginRight: '1rem'
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
      url: '/router/share/'+self.props.unitCurrent.unitId+'/inspired?markId='+self.props.markKey,
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
          key={'key_authorBlock_inspiredList_'+index}
          style={styleMiddle.boxListItem}>
          <span
            style={styleMiddle.fontListItem}>
            {this.props.usersBasic[id].account}</span>
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

    //becuase the whole Unit use the same component
    //we need to reset state for next open
    this.setState({
      axios: false,
      listify: false,
      listInspired: []
    })
  }

  render(){
    let notify= this.props.unitCurrent.marksInteraction[this.props.markKey].notify? true:false;

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
          style={Object.assign({}, styleMiddle.spanCount, notify? {color: '#ff9a5e'}: {})}>
          {this.props.unitCurrent.marksInteraction[this.props.markKey].inspired+" /"}</span>
        {
          this.state.listify &&
          <div
            style={styleMiddle.boxInspiredList}>
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
