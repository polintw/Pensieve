import React from 'react';
import SvgBell from '../../../Component/Svg/SvgBell.jsx';

const generalStyle = { //could included in a global style sheet
  boxRelativeFull: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
};

const styleMiddle = {
  boxBell: {
    width: '6%',
    position: "absolute",
    boxSizing: 'border-box',
    right: '6.4%',
    top:'50%',
    transform: 'translate(0,-39%)',
    cursor: 'pointer'
  }
};

export default class NotifyBell extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    
    this.style={

    }
  }

  _axios_nails_shareds(){
    const self = this;
    this.setState({axios: true});

    axios.get('', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
      })

      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={generalStyle.boxRelativeFull}>
        <div
          style={styleMiddle.boxBell}>
          <SvgBell/>
          {
            //Red spot here if there is any notifications
          }
        </div>
        {
          //the Notifications box if click
          //surely with the items displaying notifications previes
          //(only 'inspired' template now)
        }
      </div>
    )
  }
}
