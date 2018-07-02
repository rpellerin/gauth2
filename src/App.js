import React from 'react'
import { connect } from 'react-redux'
import DataTransfer from 'fbjs/lib/DataTransfer'
import QrCode from 'qrcode-reader'
import { refreshOTPs } from 'reducers/accounts'
import MainContainer from 'components/MainContainer'
import Accounts from 'components/Accounts'
import Actions from 'components/Actions'
import otpStringParser from 'utils/otpStringParser'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timeLeft: undefined, hasError: false }
    this.interval = setInterval(this.checkTime, 1000)
    this.reader = new FileReader()
    this.qr = new QrCode()
    this.reader.addEventListener(
      'load',
      () => {
        this.qr.decode(this.reader.result)
      },
      false
    )
    this.qr.callback = (error, rawResult) => {
      if (error) {
        console.log(error)
        window.alert(JSON.stringify(error))
        return
      }
      try {
        const account = otpStringParser(rawResult.result)
        this.props.addAccount(account)
      } catch (e) {
        window.alert(e.message)
      }
    }
  }

  componentDidMount() {
    this.props.refreshOTPs()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  checkTime = () => {
    const epoch = Math.round(new Date().getTime() / 1000.0)
    const timeLeft = 30 - (epoch % 30)
    this.setState({ timeLeft })
    if (epoch % 30 === 0) {
      this.props.refreshOTPs()
    }
  }

  onPaste = e => {
    const files = new DataTransfer(e.clipboardData).getFiles()
    if (files && files.length > 0) {
      this.reader.readAsDataURL(files[0])
    }
    console.log(files)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Local storage cannot be read.</h1>
    }
    return (
      <MainContainer onPaste={this.onPaste}>
        <Accounts timeLeft={this.state.timeLeft} />
        <Actions />
      </MainContainer>
    )
  }
}

export default connect(
  null,
  {
    refreshOTPs
  }
)(App)
