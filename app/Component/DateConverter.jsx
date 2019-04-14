import React from 'react';

export default class DateConverter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_monthRome = this._render_monthRome.bind(this);
    this.style={
      Com_DateConverter_: {
        fontSize: '1.3rem',
        letterSpacing: '0.16rem',
        textAlign: 'center',
        fontWeight: '400'
      }
    }
  }

  _render_monthRome(date){
    switch (date.getMonth()) {
      case 0:
        return "Jan. "
        break;
      case 1:
        return "Feb. "
        break;
      case 2:
        return "Mar. "
        break;
      case 3:
        return "Apr. "
        break;
      case 4:
        return "May. "
        break;
      case 5:
        return "Jun. "
        break;
      case 6:
        return "Jul. "
        break;
      case 7:
        return "Aug. "
        break;
      case 8:
        return "Sep. "
        break;
      case 9:
        return "Oct. "
        break;
      case 10:
        return "Nov. "
        break;
      case 11:
        return "Dec. "
        break;
      default:
        return date.getMonth()
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let d = new Date(this.props.datetime)

    return(
      <div
        style={this.style.Com_DateConverter_}>
        <span>{this._render_monthRome(d)}</span>
        <span>{d.getDate()}</span>
        <span>{". "}</span>
        <span>{d.getFullYear()}</span>
      </div>
    )
  }
}
