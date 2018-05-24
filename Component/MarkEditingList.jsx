import React from 'React';

export default class MarkEditingList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_MarkNumber = this._handleClick_MarkNumber.bind(this);
    this.style={

    }
  }

  _handleClick_MarkNumber(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._handleClick_MarkNumber(event.target.getAttribute('index'));
  }

  render(){
    const self = this;
    let marksList = this.state.markCircles.map(function(coordinate, index){
      return(
        <span
          index={index}
          onClick={this._handleClick_MarkNumber}>
          {index}
        </span>
      )
    });

    return(
      <div>
        {marksList}
      </div>
    )
  }
}
