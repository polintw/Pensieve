import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import CreateShare from '../../../../Component/CreateShare.jsx';
import SvgCreateonDialog from '../../../../Component/Svg/SvgCreateonDialog.jsx';

export default class TitleShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      selfCom_Title_Shared_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Title_Shared_main_: {
        display: 'inline-block',
        width: '36%',
        float: 'left',
        boxSizing: 'border-box',
        margin: '19px 5%',
        fontWeight: '700',
        fontSize: '2.8rem',
        letterSpacing: '0.54rem'
      },
      selfCom_Title_Shared_Create_: {
        width: '100%',
        height: '16vh',
        position: 'absolute',
        bottom: '5vh',
        boxSizing: 'border-box',
        padding: '1vh 3%'
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
        style={this.style.selfCom_Title_Shared_}>
        <div
          style={this.style.selfCom_Title_Shared_main_}>
          {"Shared"}
        </div>
        <div
          style={this.style.selfCom_Title_Shared_Create_}>
          <SvgCreateonDialog/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leaveSelf}/>
        </div>
      </div>
    )
  }
}
