import React from 'react'

/**
 * A component that once clicked, downloads a file given as props `filename`.
 * Same behavior as right-click > Save as.
 */
class JSONDownloader extends React.Component {
  constructor(props) {
    super(props)
    const url = this.createObjectUrl(props.data)
    this.state = { url }
  }

  createObjectUrl(data) {
    const json = JSON.stringify(data, null, 1)
    const blob = new Blob([json], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    return url
  }

  componentWillUnmount() {
    window.URL.revokeObjectURL(this.state.url)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    window.URL.revokeObjectURL(this.state.url)
    const url = this.createObjectUrl(newProps.data)
    this.setState({ url })
  }

  render() {
    const { children, filename, ...props } = this.props
    return (
      <a download={filename} href={this.state.url} role="button" {...props}>
        {children}
      </a>
    )
  }
}

export default JSONDownloader
