import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

class Threads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitBasic: this.props.unitBasic,
      marksSet: {},
      threadsBasic: {},
      threadsLists: {},
      authorsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this.style={
      selfCom_Threads_: {
        width: '76%',
        height: '83%',
        position: 'fixed',
        top: '7%',
        left: '12%',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      selfCom_Threads_unitBasic_: {
        width: '34%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Threads_unitBasic_pics_: {
        width: '100%',
        height: '62%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        overflow: 'hidden'
      },
      selfCom_Threads_unitBasic_pics_frame_: {
        width: '100%',
        position: 'relative',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      selfCom_Threads_unitBasic_pics_frame_div_: {
        width: '92%',
        height: '24vh',
        position: 'relative',
        margin: '0 1% 2% 0',
        overflow: 'hidden'
      },
      selfCom_Threads_unitBasic_pics_frame_div_img: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      selfCom_Threads_dialog_: {
        width: '41%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '34%',
        boxSizing: 'border-box',
        overflowY: 'scroll'
      },
      selfCom_Threads_threads_: {
        width: '25%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        overflowY: 'scroll'
      }
    }
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/actions/threads/'+this.props.match.params.sharedId, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      console.log(resObj.main)

      self.setState({
        axios: false,
        marksSet: resObj.main.marksSet,
        threadsBasic: resObj.main.threadsBasic,
        threadsLists: resObj.main.threadsLists,
        authorsBasic: resObj.main.authorsBasic
      });
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        if (thrown.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          alert('Something went wrong: '+thrown.response.data.message)
          if(thrown.response.status == 403){
            window.location.assign('/login');
          }
        } else if (thrown.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(thrown.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error: ', thrown.message);
        }
        console.log("Error config: "+thrown.config);
      }
    });
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
        style={this.style.selfCom_Threads_}>
        <div
          style={this.style.selfCom_Threads_unitBasic_}>
          <div
            style={this.style.selfCom_Threads_unitBasic_pics_}>
            <div
              style={this.style.selfCom_Threads_unitBasic_pics_frame_}>
              <div
                style={this.style.selfCom_Threads_unitBasic_pics_frame_div_}>
                <img
                  src={'/router/img/'+this.state.unitBasic.pic_layer0+'?type=thumb'}
                  style={this.style.selfCom_Threads_unitBasic_pics_frame_div_img}/>
              </div>
              {
                this.state.unitBasic.pic_layer1 &&
                <div
                  style={this.style.selfCom_Threads_unitBasic_pics_frame_div_}>
                  <img
                    src={'/router/img/'+this.state.unitBasic.pic_layer1+'?type=thumb'}
                    style={this.style.selfCom_Threads_unitBasic_pics_frame_div_img}/>
                </div>
              }
            </div>
          </div>
          {'info'}
        </div>
        <div
          style={this.style.selfCom_Threads_dialog_}>
          {'current mark'}
          {'current thread(dialogues)'}
        </div>
        <div
          style={this.style.selfCom_Threads_threads_}>
          {'threads'}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Threads));
