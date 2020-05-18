const validUsers = [
  {
    userType: "registered",
    userData: {
      firstName: "Demo user",
      lastName: "One",
      email: "demo.user@one.fi",
      password: "ZAQ!2wsx",
      userType: "registered",
      bankName: "Nordea",
      accountNo: "FI21 1234 5600 0007 80",
    },
  },
  {
    userType: "shopkeeper",
    userData: {
      firstName: "Demo user",
      lastName: "Two",
      email: "demo.user@two.fi",
      password: "ZAQ!2wsx",
      userType: "shopkeeper",
      bankName: "Nordea",
      accountNo: "FI21 1234 5600 0007 81",
    },
  },
];

module.exports = {
  validUsers,
};
