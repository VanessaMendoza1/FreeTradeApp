const formatPhoneNumber = (phoneNumber) => {
    let carrierCode = phoneNumber.slice(0, 3)
    let remainingNumber = phoneNumber.slice(3)

    return "(" + carrierCode + ")" + remainingNumber
}

export {
    formatPhoneNumber
}