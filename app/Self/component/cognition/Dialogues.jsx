import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import DraftDisplay from '../../../Component/Draft/DraftDisplay.jsx';
import SvgPropic from '../../../Component/Svg/SvgPropic.jsx';
import Unit from '../../../Unit/Unit/Unit.jsx';

export default class Dialogues extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      orderList: [],
      dialoguesSet: {},
      markBasic: {},
      unitBasic: {},
      userBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      selfCom_Dialogues_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Dialogues_nails_: {
        width: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      selfCom_Dialogues_nails_div_: {
        display: 'inline-block',
        width: '43%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      },
      selfCom_Dialogues_nails_div_recent_: {
        width: '64%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      selfCom_Dialogues_nails_div_recent_user: {
        width: '100%',
        height: '72%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem'
      },
      selfCom_Dialogues_nails_div_recent_time: {
        width: '50%',
        height: '15%',
        position: 'absolute',
        top: '85%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.3rem',
        fontWeight: '300',
        letterSpacing: '0.1rem'
      },
      selfCom_Dialogues_nails_div_origin_: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '64%',
        boxSizing: 'border-box'
      },
      selfCom_Dialogues_nails_div_origin_img_: {
        maxWidth: '100%',
        maxHeight: '42%',
        position: 'absolute',
        top: '79%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      selfCom_Dialogues_nails_div_origin_mark: {
        width: '100%',
        height: '58%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.3rem',
        fontWeight: '300',
        letterSpacing: '0.1rem'
      }
    }
  }

  _construct_UnitInit(match, location){
    let urlQuery = querystring.parse(location.search);
    let unitInit = {marksify: true, initMark: this.state.markBasic[urlQuery.thread].markId, layer: this.state.markBasic[urlQuery.thread].layer};
    return unitInit;
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/user/cognition/dialogues';
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return {
              axios: false,
              orderList: resObj.main.orderList,
              dialoguesSet: resObj.main.dialoguesSet,
              markBasic: resObj.main.markBasic,
              unitBasic: resObj.main.unitBasic,
              userBasic: resObj.main.userBasic
            }
          });
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let dialogues = self.state.orderList.map(function(dataKey, index){
      let dialogueData = self.state.dialoguesSet[dataKey];
      let markBasicData = self.state.markBasic[dataKey];
      return(
        <div
          key={'key_Dialogues_block_'+index}
          style={self.style.selfCom_Dialogues_nails_div_}>
          <Link
            to={{
              pathname: self.props.match.url+"/unit",
              search: '?theater&unitId='+self.props.unitId+"&thread="+dataKey,
              state: {from: self.props.location}
            }}>
            <div
              style={self.style.selfCom_Dialogues_nails_div_recent_}>
              <div
                style={self.style.selfCom_Dialogues_nails_div_recent_user}>
                <DraftDisplay
                  editorState={dialogueData.editorContent}/>
              </div>
              {
                "editorContentBynot" in dialogueData &&
                <div>
                  <DraftDisplay
                    editorState={dialogueData.editorContentBynot}/>
                </div>
              }
              <div
                style={self.style.selfCom_Dialogues_nails_div_recent_time}>
                {dialogueData.created}
              </div>
            </div>
            <div
              style={self.style.selfCom_Dialogues_nails_div_origin_}>
              <div
                style={self.style.selfCom_Dialogues_nails_div_origin_mark}>
                <DraftDisplay
                  editorState={markBasicData.editorContent}/>
              </div>
              <img
                src={'/router/img/'+self.state.unitBasic[markBasicData.unitId][markBasicData.layer==0?"pic_layer0":"pic_layer1"]+'?type=thumb'}
                style={self.style.selfCom_Dialogues_nails_div_origin_img_}/>
            </div>
          </Link>
        </div>
      )
    })

    return(
      <div
        style={this.style.selfCom_Dialogues_}>
        <div
          style={this.style.selfCom_Dialogues_nails_}>
          {dialogues}
        </div>
        <Route path={this.props.match.path+"/unit"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}
