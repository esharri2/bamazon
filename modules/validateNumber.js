function validateNumber (num) {
  if (!isNaN(num) && num !== "") {
    return true;
  } else {
    return "Please enter a number for this field.";
  }
};

module.exports = validateNumber;
