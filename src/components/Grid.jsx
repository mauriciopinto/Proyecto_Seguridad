import React from 'react'

export class Grid extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return (
            <div style={{
                display: 'grid', 
                gridTemplateRows: this.props.gridTemplateRows, 
                gridTemplateColumns: this.props.gridTemplateColumns,
                height: '100%',
                backgroundColor: "#81b1d1"
                }}>
                {this.props.children}
            </div>
        )
    }
}

export class GridElement extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return (
            <div style={{gridRow: this.props.gridRow, gridColumn: this.props.gridColumn, boxShadow: "4px 8px 8px rgba(0,0,0,0.3)", backgroundColor: this.props.bg, zIndex:this.props.z}}>
                {this.props.children}
            </div>
        )
    }
}