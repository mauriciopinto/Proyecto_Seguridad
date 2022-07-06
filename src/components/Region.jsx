import React from 'react';

class Region extends React.Component {
    constructor(props) {
        super (props);
    }

    render () {
        if (this.props.show) {
            return (
                <div style={{height: "80%", paddingTop: "80px", paddingBottom: "0px", overflowY: "scroll"}} className="scroll">
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