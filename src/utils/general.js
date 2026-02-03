const isValidPhone = (phoneNumber) => {
    // any pattern starts with +601 or 601 or 1 & have 7-8 number after dash
    // const validPhonePattern = /^(((\+?6)?0)?1)[0|2|3|4|6|7|8|9]\s*?-?\s*[0-9]{7}$|^(((\+?6)?0)?1)[1]\s*?-?\s*[0-9]{8}$/ //to include pattern 01XX-XXXXXXX
    // this will check either 011-xxxx xxx or 01x-xxx xxxx 
    const validPhonePattern =
        /^(((\+?6)?0)?1)[0|2|3|4|6|7|8|9]\s*?-?\s*[0-9]{7}$|^(((\+?6)?0)?1)[1]\s*?-?\s*[0-9]{8}$/;

    return validPhonePattern.test(phoneNumber);
};
exports.isValidPhone = isValidPhone;

const isValidFax = (faxNumber) => {
    // this will check either 0x-xxx xxxx or 0x-xxxx xxxx or 08x-xxx xxx
    const validFaxPattern =
        /^(\+?6)0?(?:[2-7]|9)\s*-?\s*\d{7,8}$|^(\+?6)0?(?:8[1-9])\s*-?\s*\d{6}$/;

    return validFaxPattern.test(faxNumber);
};
exports.isValidFax = isValidFax;

// format phone number to +6001XXXXXXXX or +601XXXXXXXXX
const formatPhoneNumber = (phoneNumber) => {
    // Remove all the +
    phoneNumber = phoneNumber.replace(/\+/g, "");
    // Add '+6' from the beginning of the phone number
    phoneNumber = phoneNumber.replace(/^(\+?6?0?)/, "+60");

    // Remove any existing dashes from the remaining phone number
    phoneNumber = phoneNumber.replace(/-/g, "");

    // Remove any existing whitespace
    phoneNumber = phoneNumber.replace(/\s/g, "");

    return phoneNumber;
};
exports.formatPhoneNumber = formatPhoneNumber;

const checkAndFormatPhone = (phoneNumber) => {
    //   if (isCorrectPhoneFormat(phoneNumber)) return phoneNumber;

    if (isValidPhone(phoneNumber) || isValidFax(phoneNumber))
        return formatPhoneNumber(phoneNumber);

    return false;
};
exports.checkAndFormatPhone = checkAndFormatPhone;