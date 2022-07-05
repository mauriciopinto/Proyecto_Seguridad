import React from 'react';

class Region extends React.Component {
    constructor(props) {
        super (props);
    }

    render () {
        if (this.props.show) {
            return (
                <div>
                    {this.props.components}
                </div>
            )
        }
        else {
            return (
                <></>
            )
        }
    }
}

export default Region;