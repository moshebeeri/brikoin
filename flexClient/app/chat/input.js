import {Component} from 'react'
import React from 'react'

class Input extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  onChange (e) {
    this.setState({text: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({text: ''})
    this.props.onSendMessage(this.state.text)
  }

  render () {
    return (
      <div className='Input'>
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            style={{fontSize: 14}}
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type='text'
            placeholder='Enter your message and press ENTER'
            autofocus
          />
          <button>Send</button>
        </form>
      </div>
    )
  }
}

export default Input
