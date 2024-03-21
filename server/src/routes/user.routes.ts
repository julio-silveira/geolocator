import { Router } from "express";

const router = Router();


router.get('/user', async (req, res) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
  }

  return user;
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: 'Region not found' });
  }

  user.name = update.name;

  await user.save();

  return res.sendStatus(201);
});

server.use(router);

export default server.listen(3003);
