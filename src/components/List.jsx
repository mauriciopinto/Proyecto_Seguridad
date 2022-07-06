import React from 'react'
import '../App.css'
import { pageStyle } from '../style/general'

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
            <ul style={pageStyle.listStyle.generalStyle} className="scroll">
                {this.props.items.map(
                    (i,j) => {
                        return (
                            <li key={j} style={pageStyle.listStyle.listItemStyle}>
                                <h3 style={pageStyle.listStyle.listItemStyle.liHeaderStyle}>{i.Subject}</h3>
                                <p style={pageStyle.listStyle.listItemStyle.liSubTitleStyle}>{"De:" + i.From} </p><button onClick={() => this.props.onIlClick(i)} style={pageStyle.formStyle.submitStyle}>Decrypt</button>
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }
}

export default EmailList;