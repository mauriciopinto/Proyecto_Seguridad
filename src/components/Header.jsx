import React from 'react'

export class PageHeader extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return (
            <header>
                <h1>{this.props.text}</h1>
            </header>
            
        )
    }
}