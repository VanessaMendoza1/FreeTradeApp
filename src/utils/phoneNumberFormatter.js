const formatPhoneNumber = (phoneNumber) => {
    console.log({phoneNumber})
    if (phoneNumber == undefined || phoneNumber == null) return phoneNumber
    phoneNumber = String(phoneNumber)
    let carrierCode = phoneNumber.slice(0, 3)
    let remainingNumber = phoneNumber.slice(3)

    return "(" + carrierCode + ")" + remainingNumber
}

export {
    formatPhoneNumber
}