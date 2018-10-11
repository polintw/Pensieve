import React from 'react';
import cxBind from 'classnames/bind';

export default class UnitActionControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_unit_collect =this._handleClick_unit_collect.bind(this);
    this.style={
      Com_UnitActionControl_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Com_UnitActionControl_span: {
        display: 'inline-block',
        width: '43%',
        height: '100%',
        position: 'relative',
        top: '0',
        boxSizing: 'border-box',
        margin: '0 3% 0 3%',
        verticalAlign: 'middle',
        fontSize: '3.2vh',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        fontWeight: '400',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_unit_collect(event){
    event.preventDefault();
    event.stopPropagation();
    const self = this;
    self.props._set_axios(true);

    axios.patch('/router/user/newCollect', {"unitName": this.props.unitName}, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function (res) {
        if(res.status = 200){
          console.log("success");
          self.props._set_axios(false);
          alert("成功將本篇加入到您的收藏!");
        }else{
          console.log("Failed: "+ res.data.err);
          self.props._set_axios(false);
          alert("Failed, please try again later");
        }
    }).catch(function (error) {
      console.log(error);
      self.props._set_axios(false);
      alert("Failed, please try again later");
    });
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionControl_}>
        <div>
          <span>
            {"回應"}
          </span>
          <span
            style={this.style.Com_UnitActionControl_span}
            onClick={this._handleClick_unit_collect}>
            {'推廣'}
          </span>
        </div>
      </div>
    )
  }
}
