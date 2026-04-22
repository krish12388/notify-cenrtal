const Notice = require('../models/Notice');
const Notification = require('../models/Notification');
// const User = require('../models/User'); // COMMENTED FOR POSTGRES MIGRATION
const pgdb = require('../config/pgdb');
const socketHandler = require('../utils/socketHandler');

exports.createNotice = async (req, res, next) => {
  try {
    const { title, description, category, targetAudience, priority, expiryDate } = req.body;
    
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`, // Local storage path, ideally replace with Cloudinary URL
      fileType: file.mimetype
    })) : [];

    const audience = targetAudience ? JSON.parse(targetAudience) : { type: 'all' };

    const notice = await Notice.create({
      title, description, category, targetAudience: audience, priority, expiryDate, attachments, postedBy: req.user.id
    });

    // Notify targeted users
    let query = {};
    if (audience.type === 'branch') query.branch = audience.branch;
    else if (audience.type === 'year') query.year = audience.year;

    /* COMMENTED FOR POSTGRES MIGRATION
    const users = await User.find(query).select('_id');
    */
    let pgQueryStr = 'SELECT id as "_id" FROM users WHERE role = $1';
    let pgParams = ['student'];
    if (audience.type === 'branch') {
      pgQueryStr += ' AND branch = $2';
      pgParams.push(audience.branch);
    } else if (audience.type === 'year') {
      pgQueryStr += ' AND year = $2';
      pgParams.push(audience.year);
    }
    const { rows: users } = await pgdb.query(pgQueryStr, pgParams);
    const notificationDocs = users.map(u => ({
      recipient: u._id,
      notice: notice._id,
      message: `New Notice: ${title}`
    }));
    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
    }
    
    // Emit socket event
    const io = socketHandler.getIO();
    const eventName = priority === 'urgent' ? 'urgent-notice' : 'new-notice';
    if (audience.type === 'all') {
      io.to('all-students').emit(eventName, notice);
    } else if (audience.type === 'branch') {
      io.to(`branch-${audience.branch}`).emit(eventName, notice);
    } else if (audience.type === 'year') {
      io.to(`year-${audience.year}`).emit(eventName, notice);
    }

    res.status(201).json({ success: true, data: notice });
  } catch (error) { next(error); }
};

exports.getNotices = async (req, res, next) => {
  try {
    const { category, branch, year, priority, search, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) query.$text = { $search: search };
    
    // Expiry check
    query.$or = [{ expiryDate: { $gt: new Date() } }, { expiryDate: { $exists: false } }, { expiryDate: null }];

    const skip = (page - 1) * limit;
    
    const notices = await Notice.find(query)
      // .populate('postedBy', 'name role') // COMMENTED FOR POSTGRES MIGRATION
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean to modify the object
      
    // Fetch users from Postgres
    const userIds = [...new Set(notices.map(n => n.postedBy?.toString()))];
    if (userIds.length > 0) {
      const { rows: users } = await pgdb.query('SELECT id, name, role FROM users WHERE id = ANY($1::varchar[])', [userIds]);
      const userMap = {};
      users.forEach(u => userMap[u.id] = { _id: u.id, name: u.name, role: u.role });
      
      notices.forEach(n => {
        n.postedBy = userMap[n.postedBy.toString()] || n.postedBy;
      });
    }

    const totalCount = await Notice.countDocuments(query);

    res.status(200).json({ success: true, count: notices.length, totalCount, data: notices });
  } catch (error) { next(error); }
};

exports.getNoticeById = async (req, res, next) => {
  try {
    // const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role'); // COMMENTED FOR POSTGRES MIGRATION
    const notice = await Notice.findById(req.params.id).lean();
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    // Fetch user from Postgres
    const { rows: users } = await pgdb.query('SELECT id, name, role FROM users WHERE id = $1', [notice.postedBy.toString()]);
    if (users.length > 0) {
      notice.postedBy = { _id: users[0].id, name: users[0].name, role: users[0].role };
    }

    res.status(200).json({ success: true, data: notice });
  } catch (error) { next(error); }
};

exports.updateNotice = async (req, res, next) => {
  try {
    let notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    if (notice.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    const io = socketHandler.getIO();
    io.to('all-students').emit('notice-updated', notice);
    
    res.status(200).json({ success: true, data: notice });
  } catch (error) { next(error); }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    if (notice.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await notice.deleteOne();
    
    const io = socketHandler.getIO();
    io.to('all-students').emit('notice-deleted', req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.archiveNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    notice.isActive = !notice.isActive;
    await notice.save();
    
    res.status(200).json({ success: true, data: notice });
  } catch (error) { next(error); }
};
