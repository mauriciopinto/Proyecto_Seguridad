var styleColors = {
    primaryColor: '#ffffff',
    secondaryColor: '#85b7d6',
    errorBackgroudColor: '#f78181',
    fontPrimaryColor: '#000000',
    fontSecondaryColor: '#85b7d6',
    fontInverseColor: '#ffffff',
    errorFontColor: '#b81111',
}

var tableStyle = {
    generalStyle: {
        borderRadius: '4px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)'
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

var formStyle = {
    generalStyle: {
        borderLeft: 'solid 4px ' + styleColors.secondaryColor
    },
    submitStyle: {
        backgroundColor: styleColors.secondaryColor,
        color: styleColors.fontInverseColor,
        border: 'none'
    }
}

var formCenterStyle = {
    generalStyle: {
        borderLeft: 'solid 4px ' + styleColors.secondaryColor,
        margin: 'auto'
    },
    submitStyle: {
        backgroundColor: styleColors.secondaryColor,
        color: styleColors.fontInverseColor,
        border: 'none'
    }
}

export var pageStyle = {
    colors: styleColors,
    tableStyle: tableStyle,
    formStyle: formStyle,
    formCenterStyle: formCenterStyle
}