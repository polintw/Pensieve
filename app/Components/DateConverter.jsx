import React from 'react';

export default class DateConverter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_monthRome = this._render_monthRome.bind(this);
    this._set_styleByProps = this._set_styleByProps.bind(this);
    this.style={
      fontGeneral: {
        fontSize: '1.4rem',
        fontWeight: '400',
        color: '#757575'
      },
      fontLayers: {
        fontSize: '1rem',
        letterSpacing: '0.05rem',
        textAlign: 'right',
        fontWeight: '300',
        color: 'rgba(250,250,250,0.7)'
      },
      fontTitle: {
        fontSize: '1.37rem',
        letterSpacing: '0.07rem',
        textAlign: 'center',
        fontWeight: '400', //there is 500 in Gill Sans Nova
        color:'#6e6e6e'
      }
    }
  }

  _set_styleByProps(){
    switch (this.props.place) {
      case 'title':
        return this.style.fontTitle
        break;
      case 'layers':
        return this.style.fontLayers
        break;
      default:
        return this.style.fontGeneral
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
    let d = new Date(this.props.datetime)

    return(
      <div
        style={Object.assign({}, this._set_styleByProps(), this.props.styles)}>
        <span>{this._render_monthRome(d)}</span>
        <span>{d.getDate()}</span>
        <span>{". "}</span>
        <span>{d.getFullYear()}</span>
      </div>
    )
  }
}
