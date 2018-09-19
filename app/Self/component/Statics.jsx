import React from 'react';
import SvgPropic from '../../Component/SvgPropic.jsx';

export default class FrontStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Statics_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Statics_navStatics: {
        width: '100%',
        height: '16vh',
        position: 'absolute',
        top: '10vh',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Statics_navStatics_UserName_: {
        width: '24%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '5%',
        boxSizing: 'border-box'
      },
      selfCom_Statics_navStatics_UserName_svg_: {
        display: 'inline-block',
        width: '25%',
        height: '50%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        padding: '1rem 0 0 0'
      },
      selfCom_Statics_navStatics_UserName_span_: {
        display: 'inline-block',
        position: 'absolute',
        bottom: '18%',
        left: '0',
        boxSizing: 'border-box',
        padding: '1% 0',
        fontSize: '1.6rem',
        letterSpacing: '0.12rem',
        color: '#222222'
      },
      selfCom_Statics_display_: {
          width: '100%',
          position: 'absolute',
          top: '36vh',
          left: '0',
          boxSizing: 'border-box',
          padding: '3vh 4%'
      },
      selfCom_Statics_display_basic_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Statics_}>
          <div
            style={this.style.selfCom_Statics_navStatics}>
            <div
              style={this.style.selfCom_Statics_navStatics_UserName_}>
              <div style={this.style.selfCom_Statics_navStatics_UserName_svg_}>
                <SvgPropic/>
              </div>
              <span style={this.style.selfCom_Statics_navStatics_UserName_span_}>{this.props.userBasic.account}</span>
            </div>
            {"基本 "}
            {"關注 "}
            {"連結 "}
            {"外部社群 "}
          </div>
          <div
            style={this.style.selfCom_Statics_display_}>
            <div
              style={this.style.selfCom_Statics_display_basic_}>
              <section>
                <div>{"生日"}</div>
                <div>{"性別"}</div>
                <div>{"出生地"}</div>
                <div>{"居住地"}</div>
                <div>{"興趣"}</div>
              </section>
            </div>
          </div>
      </div>
    )
  }
}
