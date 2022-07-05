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
                height: '100%'
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
            <div style={{gridRow: this.props.gridRow, gridColumn: this.props.gridColumn}}>
                {this.props.children}
            </div>
        )
    }
}