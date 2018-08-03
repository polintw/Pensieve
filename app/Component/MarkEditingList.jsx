import React from 'React';

export default class MarkEditingList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_MarkNumber = this._handleClick_MarkNumber.bind(this);
    this.style={
      Com_MarkeditingList_div: {
        width: '100%',
        height: '99%',
        position: 'absolute',
        top: '1%',
        left: '0',
        boxSizing: 'border-box',
        padding: '0 15%'
      },
      Com_MarkeditingList_div_svg_: {
        width: '70%',
        height: '5%',
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%,0%)',
        boxSizing: 'border-box',
        margin: '0 0 10% 0',
        color: '#FAFAFA'
      }
    }
  }

  _handleClick_MarkNumber(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._handleClick_MarkNumber(event.currentTarget.getAttribute('index'));
  }

  render(){
    const self = this;
    let marksList = this.props.markCircles.map(function(coordinate, index){
      return(
        <svg
          key={'key_Com_MarkeditingList_div_svg_'+index}
          index={index}
          style={self.style.Com_MarkeditingList_div_svg_}
          onClick={self._handleClick_MarkNumber}>
          <defs><style>{".cls-1{fill:#FAFAFA;stroke:#FAFAFA;strokeWidth:1.2px;fontSize:3.6vh;}"}</style></defs>
          <text x="50%" y="50%" textAnchor="middle" className='cls-1'>{index}</text>
          <circle r="2.2vh" cx="50%" cy="50%" stroke='#FAFAFA' fill="transparent" style={{cursor: 'pointer'}}/>
        </svg>
      )
    });

    return(
      <div
        style={this.style.Com_MarkeditingList_div}>
        {marksList}
      </div>
    )
  }
}
