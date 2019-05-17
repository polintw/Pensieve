import React from 'react';

const generalStyle = { //could included in a global style sheet
  boxRelativeFull: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
};

const styleMiddle = {

};

export default class NotifyBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();

    this.style={

    }
  }

  _axios_bell_Count(){
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
      <div>
        //surely with the items displaying notifications previews
        //(only 'inspired' template now)
        //limit amount each time, and have 'status'
        //with, the whole "NavWall" to easily close the box

      </div>
    )
  }
}
