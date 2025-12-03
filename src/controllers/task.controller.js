const Task = require('../models/task.model');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');

// POST /tasks
exports.createTask = async (req, res) => {
  const { error, value } = createTaskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const task = new Task({ ...value, userId: req.user.id });
  await task.save();
  res.status(201).json(task);
};

// GET /tasks
// supports filtering: ?status=Pending&priority=High
// sorting: ?sort=priority or sort=-createdAt
// pagination: ?page=1&limit=10
exports.getTasks = async (req, res) => {
  const { page = 1, limit = 10, status, priority, sort } = req.query;
  const query = { userId: req.user.id };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));

  const skip = (pageNum - 1) * limitNum;
  const sortObj = {};
  if (sort) {
    // example: sort=priority or sort=-createdAt
    const fields = sort.split(',');
    fields.forEach(field => {
      if (field.startsWith('-')) sortObj[field.slice(1)] = -1;
      else sortObj[field] = 1;
    });
  } else {
    sortObj.createdAt = -1;
  }

  const [tasks, totalCount] = await Promise.all([
    Task.find(query).sort(sortObj).skip(skip).limit(limitNum),
    Task.countDocuments(query)
  ]);

  res.json({
    tasks,
    meta: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(totalCount / limitNum)
    }
  });
};

// GET /tasks/:id
exports.getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
  const { error, value } = updateTaskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: value },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(204).send();
};
