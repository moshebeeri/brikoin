import {Component} from 'react'
import React from 'react'
import './messages.css'
class Messages extends Component {
  render () {
    const {messages} = this.props
    return (
      <ul className='Messages-list'>
        {messages.map(m => this.renderMessage(m))}
      </ul>
    )
  }

  renderMessage (message) {
    const {currentMember} = this.props
    const messageFromMe = message.me
    const className = messageFromMe
            ? 'Messages-message currentMember' : 'Messages-message'
    return (
      <li className={className}>
        {/* <span */}
        {/* className="avatar" */}
        {/* style={{backgroundColor: 'yellow'}} */}
        {/* /> */}
        <div className='Message-content'>
          <div className='username'>
            {message.message.author}
          </div>
          <div className='text'>{message.message.body}</div>
        </div>
      </li>
    )
  }
}

export default Messages
