import React from 'react'

import { pageStyle } from '../style/general'

class Form extends React.Component {
    constructor (props) {
        super (props)
    }

    handleSubmit

    render () {
        return this.props.center ? (
            <form onSubmit={this.props.handleSubmit} style={pageStyle.formCenterStyle.generalStyle}>
                <table>
                    <tbody>
                        {
                            this.props.fields.map(
                                (field) => {
                                    return <tr><td>{field}</td></tr>
                                }
                            )
                        }
                        <tr><td><input type="submit" value={this.props.submitText}/></td></tr>
                    </tbody>
                </table>
            </form>
        ) :
        (
            <form onSubmit={this.props.handleSubmit} style={pageStyle.formStyle.generalStyle}>
                <table>
                    <tbody>
                        {
                            this.props.fields.map(
                                (field) => {
                                    return <tr><td>{field}</td></tr>
                                }
                            )
                        }
                        <tr><td><input type="submit" value={this.props.submitText}/></td></tr>
                    </tbody>
                </table>
            </form>
        )
    }
}

export default Form;