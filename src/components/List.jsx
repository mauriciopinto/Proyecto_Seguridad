import React from 'react'

var ulStyle = {
    listStyleType: 'none',
    padding: 0
}

var liStyle = {
    cursor: 'pointer',
    border: '2px solid black',
    margin: 'auto'
}

class EmailList extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        if (this.props.items.length == 0) {
            return (
                <p>No items found...</p>
            )
        }
        return (
            <ul style={ulStyle}>
                {this.props.items.map(
                    (i) => {
                        return (
                            <li style={liStyle}>
                                <h3>{i.Subject}</h3>
                                <p>{i.From} <button onClick={() => this.props.onIlClick(i)}>Decrypt</button></p>
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }
}

export default EmailList;