import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import querystring from 'query-string';
import DraftDisplay from '../../Component/DraftDisplay.jsx';
import SvgPropic from '../../Component/SvgPropic.jsx';
import Unit from '../../Component/Unit.jsx';

export default class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inspiredList: [],
      inspiredMarksSet:{},
      unitBasicSet: {},
      userBasic: {}
    };
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      selfCom_Inspired_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Inspired_nails_: {
        width: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
      selfCom_Inspired_nails_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Inspired_nails_div_mark_: {
        width: '100%',
        height: '85%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      selfCom_Inspired_nails_div_basic_: {
        width: '100%',
        height: '15%',
        position: 'absolute',
        top: '85%',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Inspired_nails_div_basic_img: {
        maxWidth: '30%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '70%',
        transform: 'translate(-50%,0%)'
      },
      selfCom_Inspired_nails_div_basic_author_: {
        width: '60%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '1%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_BottomSection_author_text: {
        display: 'inline-block',
        width: '76%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '24%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.2vh',
        fontWeight: '400',
        color: '#000000'
      },
      Com_UnitModal_BottomSection_author_propic_: {
        display: 'inline-block',
        width: '20%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  _construct_UnitInit(match, location){
    let urlQuery = querystring.parse(location.search);
    let unitInit= Object.assign(this.state.unitBasicSet[this.state.inspiredMarksSet[urlQuery.mark].unitId], {marksify: true, initMark: urlQuery.mark, layer: this.state.inspiredMarksSet[urlQuery.mark].layer});
    return unitInit;
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/user/cognition/inspired', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        inspiredList: resObj.main.inspiredList,
        inspiredMarksSet:resObj.main.inspiredMarksSet,
        unitBasicSet:resObj.main.unitBasicSet,
        userBasic: resObj.main.userBasic
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let inspireds = self.state.inspiredList.map(function(dataKey, index){
      let dataValue = self.state.inspiredMarksSet[dataKey];
      return(
        <Link
          key={'key_Inspired_nails_'+index}
          to={{
            pathname: self.props.match.url+"/units/"+dataValue.unitId,
            search: "?mark="+dataKey,
            state: {from: self.props.location}
          }}>
          <div
            markid={dataKey}
            style={self.style.selfCom_Inspired_nails_div_}>
            <div
              style={self.style.selfCom_Inspired_nails_div_mark_}>
              <DraftDisplay
                editorState={dataValue.markEditorContent}/>
            </div>
            <div
              style={self.style.selfCom_Inspired_nails_div_basic_}>
              <div
                style={self.style.selfCom_Inspired_nails_div_basic_author_}>
                <div style={self.style.Com_UnitModal_BottomSection_author_propic_}>
                  <SvgPropic/>
                </div>
                <span style={self.style.Com_UnitModal_BottomSection_author_text}>
                  {self.state.userBasic[dataValue.authorId].authorAccount}
                </span>
              </div>
              <img
                src={'/router/img/'+self.state.unitBasicSet[dataValue.unitId].pic_layer0+'?type=thumb'}
                style={self.style.selfCom_Inspired_nails_div_basic_img}/>
            </div>
          </div>
        </Link>
      )
    })

    return(
      <div
        style={this.style.selfCom_Inspired_}>
        <div
          style={this.style.selfCom_Inspired_nails_}>
          {inspireds}
        </div>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}
