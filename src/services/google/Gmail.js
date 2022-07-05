//const google = require('googleapis')

// const scopes = ['https://www.googleapis.com/auth/gmail.readonly']
// const clientSecretPath = 'client_secret_606649275611-9ihmpjb7r8i9ic4dft3jq38a84pelscf.apps.googleusercontent.com.json'
// const tokenPath = 'token.json'


// export function auth () {
//     fetch(clientSecretPath)
//     .then(res => res.text())
//     .then(content => {
//             const {client_secret, client_id, redirect_uris} = content.installed
//             const client = google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

//             fetch(tokenPath)
//             .then(token => token.text()) 
//             .then ((token) => {
//                     client.setCredentials(JSON.parse(token));
//                     return client;
//                 }
//             )
//             .catch ((err) => generateToken(client))
//         })
//     .catch ((err) => console.log ("Error loading client secret file: ", err))
// }

// function generateToken (client) {
//     const url = client.generateAuthUrl({
//         access_type: 'offline',
//         scope: scopes
//     })

//     console.log("authorize this app by visiting this URL: ", url);

//     return client
// }

// export function getProfile (client) {
//     const gmail = google.gmail({version: 'v1', client})
//     let res = gmail.users.getProfile({
//         userId: 'me'
//     });
//     console.log (res.data)
// }


// function sendMail (client) {
//     const gmail = google.gmail({version: 'v1', client})
//     gmail.users.messages.send()
// }