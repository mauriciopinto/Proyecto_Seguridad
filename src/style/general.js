import { padding } from "aes-js"

var styleColors = {
    primaryColor: '#ffffff',
    secondaryColor: '#83b5d4',
    tertiaryColor: '#f1f1f1',
    errorBackgroudColor: '#f78181',
    highlightColor: '#118743',
    fontPrimaryColor: '#000000',
    fontSecondaryColor: '#85b7d6',
    fontInverseColor: '#ffffff',
    errorFontColor: '#b81111',
}

var tableStyle = {
    generalStyle: {
        borderRadius: '4px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.5)'
    },
    tableHeaderStyle: {
        backgroundColor: styleColors.secondaryColor,
        color: styleColors.fontInverseColor
    },
    tableDataStyle: {
        backgroundColor: styleColors.primaryColor,
        color: styleColors.fontPrimaryColor,
        border: '1px solid grey'
    }
}

var formInputStyle = {
    border: 'none',
    borderRadius: '4px'
}

var formStyle = {
    generalStyle: {
        margin: 'auto',
        borderRadius: "8px"
    },
    submitStyle: {
        cursor: "pointer",
        backgroundColor: styleColors.highlightColor,
        color: styleColors.fontInverseColor,
        border: 'none',
        padding: "8px",
        fontWeight: "bold",
        borderRadius: "4px"
    },
    inputStyle: formInputStyle
}

var formCenterStyle = {
    generalStyle: {
        margin: 'auto'
    },
    submitStyle: {
        backgroundColor: styleColors.highlightColor,
        color: styleColors.fontInverseColor,
        border: 'none',
        padding: "8px",
        fontWeight: "bold",
        borderRadius: "4px"
    },
    inputStyle: formInputStyle
}

var listStyle = {
    generalStyle: {
        listStyleType: 'none',
        padding: 0,
        overflowY: "scroll",
        overflowX: "hidden",
        height: "80%",
        padding: "4px",
        margin: "8px",
    },
    listItemStyle: {
        cursor: 'pointer',
        boxShadow: "0px 4px 4px rgba(0,0,0,0.3)",
        borderRadius: '8px',
        margin: 'auto',
        backgroundColor: styleColors.primaryColor,
        padding: "4px",
        marginTop: "0.5em",
        liHeaderStyle: {
            color: styleColors.fontPrimaryColor,
            fontSize: "1em"
        },
        liSubTitleStyle: {
            color: styleColors.fontPrimaryColor,
            fontSize: "1em",
        }
    }
}

var mainStyle = {
    backgroundColor: styleColors.tertiaryColor,
}

export var pageStyle = {
    colors: styleColors,
    tableStyle: tableStyle,
    formStyle: formStyle,
    formCenterStyle: formCenterStyle,
    listStyle: listStyle,
    mainStyle: mainStyle
}