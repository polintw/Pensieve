import React from 'React';

export default class Ref extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Ref = this._handleClick_Ref.bind(this);
    this.style={
      div_ref_Title: {
        display: 'inline-block',
        width: '60%',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA',
        verticalAlign: 'top'
      },
      div_ref_img: {
        display: 'inline-block',
        width: '40%',
        height: '100%',
        boxSizing: 'border-box'
      },
      img_ref_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        margin: 'auto'
      }
    }
  }

  _handleClick_Ref(event){
    event.preventDefault();
    event.stopPropagation();
    window.open(this.props.refData.webLink, '_blank');
  }

  render(){
      return(
        <div
          style={this.props.componentStyle}
          onClick={this._handleClick_Ref}>
          <div
              style={this.style.div_ref_Title}>
              <span>
                {
                  this.props.refData.title?
                  this.props.refData.title:
                  "(請新增網站敘述)"
                }
              </span>
          </div>
          <div
            style={this.style.div_ref_img}>
            <img
              src={this.props.refData.img?this.props.refData.img:"/favicon.ico"}
              style={this.style.img_ref_img}/>
          </div>
        </div>
      )
  }
}
