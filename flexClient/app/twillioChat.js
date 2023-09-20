import React, { Component } from 'react'
import { connect } from 'react-redux'
import {createChatToken, createChatTask, cleanToken, moveToVideo} from './redux/actions/video'
import Messages from './chat/messages'
import Input from './chat/input'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Videocam from '@material-ui/icons/Videocam'
import ChatIcon from '@material-ui/icons/Chat'
import Button from '@material-ui/core/Button'
const Chat = require('twilio-chat')
const styles = theme => ({
  root: {
    marginLeft: 5,
    marginTop: 20,
    padding: 5,
    width: 400
  },
  button: {
    width: 20,
    marginLeft: 5,
    backgroundColor: '#3F7BD8'
  }
})
class TwilioChat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      creating: false,
      username: ':משה בארי',
      joined: '',
      chanelName: 'general Chanel' + new Date().getTime()
    }
  }

  async createChatClient () {
    const {newToken, createChatTask} = this.props
    console.log('Creating Chat Client')
    if (!this.state.creating && newToken) {
      this.setState({creating: true})
      console.log(newToken)
      let client = await Chat.Client.create(newToken)
      console.log('CLIENT CREATED')
      this.setState({client: client})
      let chanel = await this.createGeneralChannel(client)
      await this.configureChannelEvents(chanel)
      createChatTask(chanel.sid, this.state.username)
    }
  }

  startChat () {
    const {createChatTask} = this.props
    if (this.state.channel) {
      createChatTask(this.state.channel.sid, this.state.username)
    }
  }

  moveToVideo () {
    const {moveToVideo} = this.props
    if (this.state.channel) {
      moveToVideo(this.state.channel.sid)
    }
  }

  render () {
    const {classes} = this.props
    const {messages, client } = this.state
    return <div style={{}}>

      <Paper className={classes.root} elevation={1}>
        <div>
          <Button variant='contained' onClick=ß{this.createChatClient.bind(this)} className={classes.button}>
            <ChatIcon />
          </Button>
          {/* <RaisedButton label='Start Chat' secondary onClick={this.startChat.bind(this)} /> */}
          {this.state.channel &&
          <Button variant='contained' onClick={this.moveToVideo.bind(this)} className={classes.button}>
            <Videocam />
          </Button>}
        </div>
        {messages && <Messages messages={messages} />}
        {client && <Input onSendMessage={this.handleNewMessage.bind(this)} />}
      </Paper>
    </div>
  }

  componentDidUpdate () {
    // const {createChatToken, change, newToken} = this.props
    // // if (!newToken) {
    // //   createChatToken(this.state.username)
    // // }
    // if (newToken && !this.state.creating) {
    //
    // }
  }

  componentDidMount () {
    this.props.createChatToken(this.state.username)
  }

  joinGeneralChannel (chatClient) {
    return new Promise((resolve, reject) => {
      chatClient.getSubscribedChannels().then(() => {
        chatClient.getChannelByUniqueName(this.state.chanelName).then((channel) => {
          this.addMessage({ body: 'Joining general channel...' })
          console.log('Joining general channel... ')
          this.setState({ channel: channel })

          channel.join().then(() => {
            this.addMessage({ body: `Joined general channel as ${this.state.username}` })
            console.log(`Joined general channel as ${this.state.username}`)
            window.addEventListener('beforeunload', () => channel.leave())
          }).catch(() => reject(Error('Could not join general channel.')))

          resolve(channel)
        }).catch(() => reject(Error('Could not find general channel.')))
      }).catch(() => reject(Error('Could not get channel list.')))
    })
  }

  configureChannelEvents (channel) {
    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
    })

    channel.on('memberJoined', (member) => {
      this.addMessage({ body: `${member.identity} has joined the channel.` })
    })

    channel.on('memberLeft', (member) => {
      this.addMessage({ body: `${member.identity} has left the channel.` })
    })
  }

  handleNewMessage (text) {
    if (this.state.channel) {
      this.state.channel.sendMessage(text)
    }
  }

  createGeneralChannel (chatClient) {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Creating general channel...' })
      console.log('Creating general channel...')
      chatClient
        .createChannel({ uniqueName: this.state.chanelName, friendlyName: 'Flex WebChat' })
        .then(async () => {
          const chanel = this.joinGeneralChannel(chatClient)
          resolve(chanel)
        })
        .catch(async () => {
          this.joinGeneralChannel(chatClient)
          console.log('Failed to create changel')
          let chanel = await chatClient.getChannelByUniqueName(this.state.chanelName)
          resolve(chanel)
        })
    })
  }

  addMessage (message) {
    const messageData = { message: message, me: message.author === this.state.username }
    if (message.author === 'undefined') {
      messageData.message.author = 'בנקאי'
    }
    this.setState({
      messages: [...this.state.messages, messageData]
    })
  }
}

const mapStateToProps = (state, props) => (
  {
    newToken: state.video.newToken,
    change: state.video.change

  })

const mapDispatchToProps = {
  createChatToken, createChatTask, cleanToken, moveToVideo
}
export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(TwilioChat))
