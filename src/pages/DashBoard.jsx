import React from "react";
import { Base64 } from "js-base64";
import EmailList from "../components/List";
import Region from "../components/Region";
import { aes_enc, aes_dec, aes_pad_plaintext, arr_to_bytes, bytes_to_arr } from "../services/encryption/aes";
import { Grid, GridElement } from "../components/Grid";
import Form from "../components/Form";
import { pageStyle } from "../style/general";


const CLIENT_ID = "606649275611-9ihmpjb7r8i9ic4dft3jq38a84pelscf.apps.googleusercontent.com"
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify"



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
            currentIV: undefined,
            tokenClient: undefined,
            gapiInited: false,
            gisInited: false,
            loggedIn: false,
            profile: '',
            labelId: undefined,
            currentMessageId: undefined,
            currentKey: undefined,
            currentKeyName: ''
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
                    this.getLabels ()
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
        window.gapi.client.gmail.users.getProfile ({
            userId: 'me'
        })
        .then ((res) => this.setState({profile: res.result.emailAddress}))
    }

    getLabels () {
        window.gapi.client.gmail.users.labels.list({
            userId: 'me'
        })
        .then ((res) => {
            //console.log (res.result.labels)
            for (let i = 0; i < res.result.labels.length; i++) {
                let label = res.result.labels[i]
                if (label.name == "Encrypted") {
                    this.setState({labelId: label.id}, () => this.getEncryptedMessages())
                }
            }
        })
    }

    getEncryptedMessages () {
        this.setState ({items: []}, () => {
            window.gapi.client.gmail.users.messages.list ({
                userId: "me",
                labelIds: [this.state.labelId]
            })
            .then ((res) => {
                //console.log (res)
                let messages = res.result.messages

                for (let i = 0; i < messages.length; i++) {
                    window.gapi.client.gmail.users.messages.get ({
                        userId: "me",
                        id: messages[i].id,
                        format: 'full'
                    })
                    .then ((res) => {
                        console.log (res)
                        let data = res.result.payload.body.data
                        let from = res.result.payload.headers[1].value
                        let subject = res.result.payload.headers[3].value
                        let iv = res.result.payload.headers[4].value
                        let keyName = res.result.payload.headers[5].value
                        let labels = res.result.labelIds

                        //if (!labels.includes("SENT")) {
                        //console.log (aes_dec(Buffer.from(atob(data)), "1234567890123456"))
                        //console.log (Uint8Array.from(Base64.decode (iv).split(',')))
                        let items = this.state.items
                        items.push ({
                            From: from,
                            Subject: subject.length == 0 ? "Sin asunto" : subject,
                            Body: Uint8Array.from(Base64.decode(Base64.atob(data)).split(',')),
                            IV: Uint8Array.from(Base64.decode (iv).split(',')),
                            KeyName: keyName
                        })
                        //console.log (items)
                        this.setState ({items: items})
                        //}
                    })
                    .catch ((err) => {
                        console.log (err)
                    })
                }
            })
            .catch ((err) => {
                console.log (err)
            })
        })
    }

    checkMetadata (subject, to) {
        if (to.length == 0) {
            alert ("El correo no tiene destinatario")
            return false
        }
        if (subject.length == 0) {
            alert ("Enviando correo sin asunto")
            return true
        }
        return true
    }

    checkInputs (key, plaintext) {
        if (key.length == 0 || key.length % 16 != 0) {
            alert("Por favor ingrese una llave cuya longitud sea un múltiplo de 16")
            return false
        }
        if (plaintext.length == 0) {
            alert ("El cuerpo del correo está vacío")
            return false
        }
        return true
    }

    sendMessage (e) {
        e.preventDefault()
        console.log(e.target[4].value)
        let keyName = e.target[4].value
        let key = e.target[3].value
        let plaintext = e.target[2].value
        let iv = new Uint8Array (16)
        iv = window.crypto.getRandomValues(iv)
        //console.log (iv)
        
        if (!this.checkInputs (key, plaintext)) {
            return
        }

        plaintext = aes_pad_plaintext (plaintext)
        
        console.log (plaintext, plaintext.length)

        let ciphertext = aes_enc(plaintext, key, iv)

        ciphertext = Base64.encode(ciphertext.toString())
        iv = Base64.encode(iv.toString())
        //console.log (iv)
        
        let subject = e.target[1].value
        let to = e.target[0].value
        let from = this.state.profile
        
        if (!this.checkMetadata (subject, to)) {
            return
        }
        
        let message = 
        "From: " + from + "\r\n" +
        "To: " + to + "\r\n" +
        "Subject: " + subject + "\r\n" + 
        "IV: " + iv + "\r\n" + 
        "KeyName: " + keyName + "\r\n\r\n" + ciphertext

        //console.log (message)

        window.gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                'raw': Base64.btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
            }
        })
        .then ((res) => {
            let messageId = res.result.id
            window.gapi.client.gmail.users.messages.modify ({
                userId: "me",
                id: messageId,
                resource: {
                    'addLabelIds': [this.state.labelId]
                }
            })
            .then ((res) => {
                console.log ("updated label")
                this.getEncryptedMessages ()
            })
            .catch ((err) => {
                console.log (err)
            })
        })
        .catch ((err) => console.log (err))
    }

    openDecrypt (message) {
        console.log (message)
        if (this.state.showDecrypt) {
            this.setState({
                showDecrypt: false, 
                currentFrom: '',
                currentSubject: '',
                currentBody: '',
                currentPlaintext: '',
                currentIV: undefined,
                currentKeyName: ''
            })
        }
        this.setState({
            showDecrypt: true, 
            currentFrom: message.From,
            currentSubject: message.Subject,
            currentBody: message.Body,
            currentIV: message.IV,
            currentKeyName: message.KeyName
        })
    }

    decrypt (e) {
        e.preventDefault()

        let ciphertext = this.state.currentBody
        let key = e.target[0].value
        let iv = this.state.currentIV

        let plaintext = aes_dec (ciphertext, key, iv)
        this.setState({currentPlaintext: plaintext})
    }

    render () {
        if (!this.state.loggedIn) {
            return (
                <>
                <h1>Login with Google to send E2E encrypted email</h1>
                <button id="auth-btn" style={pageStyle.formStyle.submitStyle}>Login</button>
                <p style={{color: pageStyle.colors.errorFontColor}}>No olvides agregar o solicitar la etiqueta "ENCRYPTED" para tu cuenta de Gmail para así poder filtrar los correos encriptados</p>
                </>
            )
        }
        else {
            return (
                <Grid gridTemplateRows='repeat(4, 1fr)' gridTemplateColumns='repeat(3, 1fr)'>
                    <GridElement gridRow='1/5' gridColumn='1' bg="#81b1d1" z="1">
                        <h2 style={{color: "white"}}>Envía un mensaje encriptado</h2>
                        <Form handleSubmit={this.sendMessage}
                            fields={[
                                <p style={{color: pageStyle.colors.fontInverseColor, fontWeight: "bold", fontSize: "0.8em"}}>Este mensaje será encriptado localmente y enviado al receptor a través del servicio de Gmail. De esta manera, la información almacenada en los servidores de Google estará segura</p>,
                                <input type='email' placeholder='Para' style={{width: '100%', border:"none", padding: "4px", borderRadius: "4px"}}/>,
                                <input type='text' placeholder='Asunto' style={{width: '100%', border:"none", padding: "4px", borderRadius: "4px"}} />,
                                <textarea placeholder='Ingresa el cuerpo del correo...' style={{width: '100%', height: '200px', border:"none", padding: "4px", borderRadius: "4px"}} />,
                                <p style={{color: pageStyle.colors.fontInverseColor, fontWeight: "bold", fontSize: "0.8em"}}>Ingresa la llave secreta con la cual encriptarás el mensaje. El receptor también usará esta llave para descifrar el mensaje. Colócale un nombre para que sea más fácil de recordar qué llave usaste!</p>,
                                <input type='password' placeholder='Llave' style={{width: '100%', border:"none", padding: "4px", borderRadius: "4px"}} />,
                                <input type='text' placeholder="Nombre de la llave" style={{width: '100%', border:"none", padding: "4px", borderRadius: "4px"}} />
                            ]}
                            submitText="Encrypt and Send"
                            center={true}
                        />
                    </GridElement>
                    <GridElement gridRow='1/5' gridColumn='2' bg="#73A0E1" z="0">
                        <h2 style={{color: "white"}}>E2EE Inbox</h2>
                        <EmailList items={this.state.items} onIlClick={this.openDecrypt}/>
                    </GridElement>
                    <GridElement gridRow='1/5' gridColumn='3' bg="#568EDF" z="0">
                        <Region 
                            show={this.state.showDecrypt} 
                            components={
                                <>
                                    <form onSubmit={this.decrypt} style={pageStyle.formStyle.generalStyle}>
                                        <table style={{margin: 'auto', width: '80%', boxShadow: "0px 4px 12px rgba(0,0,0,0.3)", backgroundColor: "#ffffff", padding: "12px", borderRadius: "8px"}}>
                                            <tbody style={{borderRadius: "8px"}}>
                                                <tr style={{marginTop: "2px"}}><td colSpan={2} style={{padding: "8px"}}><h2>{this.state.currentSubject.length == 0 ? "Sin Asunto" : this.state.currentSubject}</h2></td></tr>
                                                <tr style={{marginTop: "2px"}}><td style={{margin: "8px", fontWeight: "bold"}}>From: </td><td style={{padding: "8px"}}><h4>{this.state.currentFrom}</h4></td></tr>
                                                <tr style={{marginTop: "2px"}}><td style={{padding: "8px", fontWeight: "bold"}}>Body (Ciphertext): </td><td style={{padding: "8px"}}><p>{arr_to_bytes(this.state.currentBody)}</p></td></tr>
                                                <tr style={{marginTop: "2px"}}><td style={{padding: "8px", fontWeight: "bold"}}>Body (Plaintext): </td><td style={{padding: "8px"}}><p>{this.state.currentPlaintext}</p></td></tr>
                                                <tr style={{marginTop: "2px"}}><td colSpan={2}><p style={{width: '80%', margin: "8px", padding: "4px", color: pageStyle.colors.errorFontColor}}>{"Ingresar: " + (this.state.currentKeyName.length == 0 ? "Llave sin nombre" : this.state.currentKeyName)}</p></td></tr>
                                                <tr style={{marginTop: "2px"}}><td colSpan={2}><input type="password" placeholder={this.state.currentKeyName.length == 0 ? "Llave" : this.state.currentKeyName} style={{width: '80%', margin: "8px", padding: "4px"}}/></td></tr>
                                                <tr style={{marginTop: "2px"}}><td colSpan={2}><input type="submit" value="Decrypt" style={pageStyle.formStyle.submitStyle}/></td></tr>
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