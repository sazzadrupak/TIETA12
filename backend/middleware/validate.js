module.exports = (validator) => (req, res, next) => {
  const { error } = validator(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};
