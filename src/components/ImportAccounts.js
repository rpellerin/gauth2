import React from 'react'

class ImportAccounts extends React.Component {
  constructor(props) {
    super(props)
    this.reader = new FileReader()
    this.callback = () => {
      this.props.onReceiveFile(this.reader.result)
      if (this.input) {
        this.input.value = '' // reset
      }
    }
    this.reader.addEventListener('load', this.callback, false)
  }

  componentWillUnmount() {
    this.reader.removeEventListener('load', this.callback)
  }

  uploadFile(files) {
    if (files[0]) {
      this.reader.readAsText(files[0])
    }
  }

  render() {
    const { onReceiveFile, ...rest } = this.props
    return (
      <div {...rest} role="button" onClick={() => this.input.click()}>
        Import accounts from a file
        <input
          type="file"
          style={{ display: 'none' }}
          ref={node => (this.input = node)}
          onChange={e => this.uploadFile(e.target.files)}
        />
      </div>
    )
  }
}

export default ImportAccounts
