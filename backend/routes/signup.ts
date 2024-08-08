const router = require('express').Router();
import { Request, Response } from 'express';
router.get('/', (req: Request, res: Response) => {
  res.send('Hello Sign up!');
});

router.post('/', (req: Request, res: Response) => {
  res.send('Hello Sign up!');
});
module.exports = router;