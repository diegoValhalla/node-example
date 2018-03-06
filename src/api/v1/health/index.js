const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({ message: 'ok' });
});

module.exports = router;
