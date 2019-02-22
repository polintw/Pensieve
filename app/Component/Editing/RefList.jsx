import React from 'react';
import Ref from './Ref.jsx';

export default class RefList extends React.Component {
  constructor(props){
    super(props);
    this.basicUnit_height = 25;
    this.state = {

    };
    this._count_listHeight = this._count_listHeight.bind(this);
  }

  _count_listHeight(arr){
    let rowNum = Math.floor(arr.length/3+1);
    let totalHeight = rowNum*(this.basicUnit_height+4);
    return(
      totalHeight.toString()+'vh'
    );
  }

  render(){
    const self = this;
    let style={
      component_RefList: {
        display: 'flex',
        justifyContent: 'space-around',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        width: '72%',
        height: this._count_listHeight(this.props.refsArr),
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)'
      },
      component_ref: {
        display: 'inline-block',
        width: '30%',
        height: this.basicUnit_height.toString()+'vh',
        boxSizing: 'border-box',
        margin: '2% 0',
        border: '1px solid black',
        boxShadow: '0 1px 3px 1px',
        cursor: 'pointer'
      }
    }

    let refs = this.props.refsArr.map(function(obj, index){
      return(
        <Ref
          id={'ref_List_editing_'+index}
          componentStyle={style.component_ref}
          refData={obj}/>
      )
    })

    return(
      <div
        style={style.component_RefList}>
        {refs}
      </div>
    )
  }
}
