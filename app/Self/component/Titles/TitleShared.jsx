import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreateCoral from '../../../Component/SvgCreateCoral.jsx';

export default class TitleShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      selfCom_CogActions_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        paddingBottom: '2vh',
        borderBottom: '0.1rem solid #ff9a5e'
      },
      selfCom_CogActions_main_: {
        display: 'inline-block',
        width: '36%',
        float: 'left',
        boxSizing: 'border-box',
        margin: '0 3%',
        fontWeight: '700',
        fontSize: '3rem',
        letterSpacing: '0.6rem'
      },
      selfCom_Shared_top_: {
        width: '100%',
        height: '11vh',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '4vh'
      },
      selfCom_Shared_top_CreateShare_: {
        display: 'inline-block',
        width: '27%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginRight: '4%',
        float: 'right'
      },
    }
  }

  _submit_Share_New(dataObj){
    this.props._axios_nails_shareds();
  }


  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogActions_}>
        <div
          style={this.style.selfCom_CogActions_main_}>
          {"Shared"}
        </div>
        <div
          style={this.style.selfCom_Shared_top_}>
          <div
            style={this.style.selfCom_Shared_top_CreateShare_}>
            <SvgCreateCoral/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_leaveSelf}/>
          </div>
        </div>
      </div>
    )
  }
}
