import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import DraftDisplayforNailMark from './DraftDisplayforNailMark.jsx';

const commonStyle = {
  Com_Nails_Cosmic_pic_: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  },
  Com_Nails_Cosmic_content_: {
    width: '100%',
    minHeight: '5vh',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '2%',
    backgroudColor: '#FFFFFF'
  },
  Com_Nails_Cosmic_content_mark: {
    width: '112%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0.32rem 0 0.32rem 8%',
    marginBottom: '0.28rem',
    fontSize: '1.5rem',
    fontWeight: '400',
    letterSpacing: '0.17rem',
    lineHeight: '2.4rem',
    textAlign: 'left', // prevent influence from parent
    color: 'black'
  },
  Com_Nails_Cosmic_pic_img: {
    display: 'block', // default value was 'inline-block', but sometime it would let it leave some blank
    width: '100%',
    height: 'auto'
  },
  Com_Nails_Cosmic_pic_mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: "linear-gradient(75deg, transparent, rgba(0,0,0,0.03),rgba(0,0,0,0.12), rgba(0, 0, 0, 0.28), rgba(0,0,0,0.56),rgba(0,0,0,0.72))"
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
  },
  Com_Nails_Cosmic_pic_author: {
    display: 'inline-block',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box',
    padding: '1.5% 5%',
    fontSize: '1.42rem',
    fontWeight: '300',
    letterSpacing: '0.12rem',
    color: '#FAFAFA'
  },
  Com_Nails_Cosmic_pic_nouns_: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box',
    padding: '3% 5%'
  },
  Com_Nails_Cosmic_pic_nouns_div_: {
    position: 'relative',
    boxSizing: 'border-box',
    textAlign: 'right',
    fontSize: '1.6rem',
    fontWeight: '300',
    fontFamily: 'cwTeXMing',
    letterSpacing: '0.18rem',
    color: '#FAFAFA'
  }
}

class NailCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style={
      Com_Nails_Cosmic_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '0.08vh',
        boxShadow: '0 0 0 0.02vh',
        cursor: 'pointer'
      }
    }
  }

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitId+"_marks_"+i}
          style={commonStyle.Com_Nails_Cosmic_content_mark}>
          <DraftDisplayforNailMark
            rawContent={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    //for vision adoption, we 'fill' some blank to the Nails
    marksDOM.push(<div style={{width: '100%', height: '7vh', position: 'relative'}}></div>)
    marksDOM.unshift(<div style={{width: '100%', height: '2vh', position: 'relative'}}></div>)
    return marksDOM;
  }

  _render_nails_nouns(){
    let list = this.props.unitBasic.nounsList;
    let nounsDOM = [];

    list.forEach((id, index)=>{
      nounsDOM.push(
        <div
          key={"key_nailcosmic_"+this.props.unitId+"_nouns_"+index}
          style={commonStyle.Com_Nails_Cosmic_pic_nouns_div_}>
          {id in this.props.nounsBasic ? (
            this.props.nounsBasic[id].name) : (
              null
            )}
        </div>
      )
    })
    return nounsDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.Com_Nails_Cosmic_}>
        <div style={{width: '100%', height: '4vh', position: 'relative'}}></div>
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.unitId,
            state: {from: this.props.location}
          }}
          style={{textDecoration: 'none'}}>
          <div
            style={commonStyle.Com_Nails_Cosmic_pic_}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={commonStyle.Com_Nails_Cosmic_pic_img}
              onLoad={({currentTarget: {clientHeight}})=>this.props._set_RenderbyCol(clientHeight)}/>
            <div style={commonStyle.Com_Nails_Cosmic_pic_mask}/>
            <div style={commonStyle.Com_Nails_Cosmic_pic_author}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </div>
            <div
              style={commonStyle.Com_Nails_Cosmic_pic_nouns_}>
              {this._render_nails_nouns()}
            </div>
          </div>
          <div
            style={commonStyle.Com_Nails_Cosmic_content_}>
            {this._render_nails_Marks()}
          </div>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailCosmic));
