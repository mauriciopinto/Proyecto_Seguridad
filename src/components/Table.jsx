import React from 'react'

import { pageStyle } from '../style/general'

class Table extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return (
            <table style={pageStyle.tableStyle.generalStyle}>
                <thead>
                    {this.props.headers.map (
                            (h) => {
                                return <tr><td>{h}</td></tr>
                            }
                        )
                    }
                </thead>
                <tbody>
                    {
                        this.props.elements.map (
                            (e) => {
                                return <tr style={pageStyle.tableStyle.tableDataStyle}><td>{e}</td></tr>
                            }
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export default Table;