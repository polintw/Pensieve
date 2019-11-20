import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "../MainBanner/styles.module.css"; //Notice, we use shared css file here for easier control
import {
  nailChart,
} from '../Main/utils.js';
import {
  setIndexLists
} from '../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList,
  updateNodesBasic
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class TodayNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodeId: null,
      unitsBasic: {},
      marksBasic: {},
      wikiParagraph: [],
      wikiImg: ''
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this._axios_GET_Units = this._axios_GET_Units.bind(this);
    this._axios_GET_NodeWiki = this._axios_GET_NodeWiki.bind(this);
    this._axios_GET_todayNode = this._axios_GET_todayNode.bind(this);
    this.style={

    }
  }

  _axios_GET_Units(){
    //GET limited units list and data of this node
    const self = this;
    this.setState({axios: true});

    axios({ //use config because we want to set 'params'
      url: `/router/nouns/${this.state.nodeId}`,
      method: 'get',
      params: {limit: 3},
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_IndexLists({todayNode: resObj.main.unitsList}); //submit the list to the props.indexLists.

      self.setState((prevState, props)=>{
        return({
          axios: false,
          unitsBasic: resObj.main.unitsBasic,
          marksBasic: resObj.main.marksBasic
        });
      });

    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  _axios_GET_NodeWiki(){
    const self = this;
    this.setState({axios: true});
    //set the query link for the current node
    let nodeName = this.props.nounsBasic[this.state.nodeId].name;
    if (/\s/.test(nodeName)) { //if theres is any kind of space
      nodeName = nodeName.replace(/\s/, "%20"); //'%20' represent the 'space' in URL string
    }
    let baseURL = `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${nodeName}&utf8`;
    let imgURL = `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=pageimages&titles=${nodeName}&pithumbsize=500`;

    axios.all([
      axios({
        //IMPORTANT! we need to claim a clear req method by config because,
        //we req to a differ domain, a cross-site situation.
        //the axios would use method 'options' when facing absolute url if we didn't claim clear,
        //but the browser would block this method to a cross-site req.
        method:'get',
        url: baseURL,
        cancelToken: this.axiosSource.token}),
      axios({
        method: 'get',
        url: imgURL,
        cancelToken: this.axiosSource.token
      })
    ]).then(
      axios.spread((resIntro, resImg)=>{
        let resObj = resIntro.data; //no need to parse, res.data is already a js obj
        let pageObj = resObj.query.pages[Object.keys(resObj.query.pages)[0]]; //just a structure from origin
        let imgObj = resObj.query.pages[Object.keys(resObj.query.pages)[0]];
        //then we need to 'clean' the text
        //we retrieve only the first paragraph even it was a intro
        let strFirstLine = pageObj.extract.split(/\r?\n|\r/, 1)[0]; //use the Regex to detect line break(cover differ browser),
        //and set '1' for limit option to improve performance (no need to check after first one)
        //and remove also the additional discription,
        //but the structure the Wiki used usually contain parentheses 'inside' parentheses,
        //we could only loop it to remove all of them
        let strLastRound; //used to saved the result from last round
        do{
          strLastRound= strFirstLine;
          strFirstLine = strFirstLine.replace(/\([^\)\(]*\) */,'');
        }while(strLastRound != strFirstLine);

        let introDOM = (
          <div
            key={"key_wikiIntro_"}>
            <p
              className={classnames(styles.pWikiIntro, styles.fontWikiIntro)}>
              {strFirstLine}
            </p>
            <a
              href={`http://en.wikipedia.org/wiki/${nodeName}`}
              target="_blank"
              className={classnames(styles.linkWiki, styles.fontLink)}
              style={{textDecoration: 'none'}}>
              {"wikipedia.org"}
            </a>
          </div>
        );

        self.setState({
          wikiParagraph: [introDOM],
          wikiImg: ('thumbnail' in imgObj) ? imgObj.thumbnail.source : '' //too many page do not have a default thumbnail
        });
      })
    ).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  _axios_GET_todayNode(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/feed/custom/todayNode', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      self.props._submit_NodesBasic(resObj.main.nounsBasic);

      self.setState((prevState, props)=>{
        return ({
          axios: false,
          nodeId: resObj.main.nodesList[0]
        });
        //the TodayNode component would update after this step
        //then we fetch the data & info of this new node in 'componentDidUpdate'
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.nodeId != this.state.nodeId && !!this.state.nodeId){ //req only if the new node came and truely a real node
      this._axios_GET_NodeWiki();
      this._axios_GET_Units();
    }
  }

  componentDidMount() {
    this._axios_GET_todayNode();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['todayNode'],
        unitsDOM = [];

    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< 1 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          //the nailChart was co use with other component in Main,
          let nail = nailChart(4, unitId, this);
          unitsDOM.push(nail);
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comTodayNode)}>
        <div
          className={classnames(styles.boxWikiIntro)}>
          <div
            className={classnames(styles.boxIntroHead)}>
            <div
              className={classnames(styles.boxWikiTitle)}>
              {
                (this.state.nodeId in this.props.nounsBasic) &&
                <span
                  className={classnames(styles.fontTitle)}
                  style={{cursor: 'pointer'}}
                  onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic(this.state.nodeId, 'noun')}}>
                  {this.props.nounsBasic[this.state.nodeId].name}</span>
              }
              <span
                className={classnames(styles.spanTodayDescript, styles.fontDescript)}>
                {"Today Intro"}</span>
            </div>
            <div
              style={{
                display: 'inline',
                backgroundImage: `url(${this.state.wikiImg})`}}/>
          </div>
          {this.state.wikiParagraph}
        </div>
        <div
          className={classnames(styles.boxTodayNails)}>
          {this._render_nails()}
          <div
            style={{
              position: 'absolute', bottom: '0', left: '100%', transform: 'translate(50%, 0)'
            }}>
            <Link
              to={"/cosmic/nodes/"+this.state.nodeId}
              className={classnames(styles.linkMore, styles.fontLink)}
              style={{textDecoration: 'none'}}>
              {">more"}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_NodesBasic: (obj) => { dispatch(updateNodesBasic(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TodayNode));
