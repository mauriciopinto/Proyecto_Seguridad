import React from "react";
import EmailList from "../components/List";
import Region from "../components/Region";
import { aes_enc, aes_dec, aes_pad_plaintext, arr_to_bytes } from "../services/encryption/aes";
import { Grid, GridElement } from "../components/Grid";
import Form from "../components/Form";

const CLIENT_ID = "606649275611-9ihmpjb7r8i9ic4dft3jq38a84pelscf.apps.googleusercontent.com"
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"



class DashBoard extends React.Component {
    constructor (props) {
        super (props)

        this.state = {
            items: [], 
            showDecrypt:false, 
            currentSubject: '', 
            currentFrom: '',
            currentBody: '',
            currentPlaintext: '',
            tokenClient: undefined,
            gapiInited: false,
            gisInited: false,
            loggedIn: false,
            profile: ''
        }

        this.sendMessage = this.sendMessage.bind(this);
        this.openDecrypt = this.openDecrypt.bind(this);
        this.decrypt = this.decrypt.bind(this);
    }

    componentDidMount () {
        const e = document.getElementsByTagName("script")[0]
        let gapiScript = document.createElement("script")
        let gisScript = document.createElement("script")
        gapiScript.id = "gapi-script"
        gapiScript.src = "https://apis.google.com/js/api.js"
        gapiScript.onload = this.gapiLoaded.bind(this)
        gisScript.id = "gis-script"
        gisScript.src = "https://accounts.google.com/gsi/client"
        gisScript.onload = this.gisLoaded.bind(this)
        if (e && e.parentNode) {
            e.parentNode.insertBefore(gapiScript, e)
            e.parentNode.insertBefore(gisScript, e)
        }
        else {
            document.head.appendChild(gapiScript)
            document.head.appendChild(gisScript)
        }
        
    }

    initClient () {
            window.gapi.client.init({
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOC],
            })
            .then(() => {
                this.setState({gapiInited: true})
                this.loadButton()
            })
        }

    gapiLoaded() {
        window.gapi.load('client', this.initClient.bind(this))
        this.loadButton ()
    }

    gisLoaded () {
        let tc = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '',
        })
        this.setState({tokenClient: tc, gisInited: true})
        this.loadButton()
    }

    loadButton () {
        if (this.state.gapiInited && this.state.gisInited){
            let authBtn = document.getElementById("auth-btn");
            authBtn.onclick = () => {
                this.state.tokenClient.callback = async (resp) => {
                    if (resp.error !== undefined) {
                        throw (resp)
                    }

                    this.setState({loggedIn: true})
                    this.getProfile ()
                    
                }
                if (window.gapi.client.getToken() === null) {
                    this.state.tokenClient.requestAccessToken({prompt: 'consent'})
                }
                else {
                    this.state.tokenClient.requestAccessToken({prompt: ''})
                }
            }
        }
    }

    getProfile () {
        let response
        window.gapi.client.gmail.users.getProfile ({
            userId: 'me'
        })
        .then ((res) => this.setState({profile: res.result.emailAddress}))
    }

    sendMessage (e) {
        e.preventDefault()
        console.log(e.target)
        let key = e.target[3].value
        let plaintext = e.target[2].value
        
        plaintext = aes_pad_plaintext (plaintext)
        
        let ciphertext = aes_enc(plaintext, key)
        let subject = e.target[1].value
        let to = e.target[0].value
        let from = this.state.profile

        let message = {
            From: from,
            To: to,
            Subject: subject,
            Body: ciphertext
        }

        let items = this.state.items
        items.push(message)
        

        this.setState ({items: items})

        window.gapi.client.gmail.users.messages.send({
            userId: 'me',
            body: {
                id: "1",
                raw: {
                    partId: "1",
                    mimeType: "text/plain",
                    headers: [
                        {
                            name: "From",
                            value: from
                        },
                        {
                            name: "To",
                            value: to
                        },
                        {
                            name: "Subject",
                            value: subject
                        },
                        {
                            name: "E2E",
                            value: "true"
                        }
                    ],
                    body: {
                        data: ciphertext
                    }
                }
            }
        })
        .then ((res) => {
            console.log (res)
        })
        .catch ((err) => console.log (err))
    }

    openDecrypt (message) {
        if (this.state.showDecrypt) {
            this.setState({
                showDecrypt: false, 
                currentFrom: '',
                currentSubject: '',
                currentBody: '',
                currentPlaintext: ''
            })
        }
        this.setState({
            showDecrypt: true, 
            currentFrom: message.From,
            currentSubject: message.Subject,
            currentBody: message.Body
        })
    }

    decrypt (e) {
        e.preventDefault()

        let ciphertext = this.state.currentBody
        let key = e.target[0].value

        let plaintext = aes_dec (ciphertext, key)
        this.setState({currentPlaintext: plaintext})
    }

    render () {
        if (!this.state.loggedIn) {
            return (
                <>
                <h1>Login with Google to send E2E encrypted email</h1>
                <button id="auth-btn">Login</button>
                </>
            )
        }
        else {
            return (
                <Grid gridTemplateRows='repeat(4, 1fr)' gridTemplateColumns='repeat(3, 1fr)'>
                    <GridElement gridRow='1/5' gridColumn='1'>
                        <h2>Send an Encrypted Message</h2>
                        <Form handleSubmit={this.sendMessage}
                            fields={[
                                <input type='email' placeholder='To' style={{width: '100%'}}/>,
                                <input type='text' placeholder='Subject' style={{width: '100%'}} />,
                                <textarea placeholder='Enter email body...' style={{width: '100%', height: '200px'}} />,
                                <input type='password' placeholder='Key' style={{width: '100%'}} />,
                            ]}
                            submitText="Encrypt and Send"
                            center={true}
                        />
                    </GridElement>
                    <GridElement gridRow='1/5' gridColumn='2'>
                        <h2>E2EE Inbox</h2>
                        <EmailList items={this.state.items} onIlClick={this.openDecrypt}/>
                    </GridElement>
                    <GridElement gridRow='1/5' gridColumn='3'>
                        <Region 
                            show={this.state.showDecrypt} 
                            components={
                                <>
                                    <form onSubmit={this.decrypt}>
                                        <table style={{margin: 'auto', width: '80%'}}>
                                            <tbody>
                                                <tr><td colSpan={2}><h2>{this.state.currentSubject}</h2></td></tr>
                                                <tr><td>From: </td><td><h3>{this.state.currentFrom}</h3></td></tr>
                                                <tr><td>Body (Ciphertext): </td><td><p>{arr_to_bytes(this.state.currentBody)}</p></td></tr>
                                                <tr><td>Body (Plaintext): </td><td><p>{this.state.currentPlaintext}</p></td></tr>
                                                <tr><td colSpan={2}><input type="password" placeholder="Key" style={{width: '100%'}}/></td></tr>
                                                <tr><td colSpan={2}><input type="submit" value="Decrypt"/></td></tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </>
                            }
                        />
                    </GridElement>
                </Grid>                      
            )
        }
    }
}

export default DashBoard