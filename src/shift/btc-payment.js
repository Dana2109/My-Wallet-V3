/* eslint-disable semi */
const ShiftPayment = require('./shift-payment')

class BtcPayment extends ShiftPayment {
  constructor (wallet) {
    super()
    this._payment = wallet.createPayment()
    this._payment.from(wallet.hdwallet.defaultAccountIndex)
  }

  setFromQuote (quote) {
    super.setFromQuote(quote)
    this._payment.to(quote.depositAddress)
    this._payment.amount(Math.round(parseFloat(quote.depositAmount) * 1e8))
    this._payment.updateFeePerKb('priority')
    this._payment.build()
    return this
  }

  getFee () {
    return new Promise(resolve => {
      this._payment.sideEffect(payment => resolve(payment.finalFee))
    })
  }

  publish (secPass) {
    this._payment.sign(secPass)
    return this._payment.publish()
  }
}

module.exports = BtcPayment
