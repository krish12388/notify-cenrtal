const Bookmark = require('../models/Bookmark');

exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('notice')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error) { next(error); }
};

exports.addBookmark = async (req, res, next) => {
  try {
    const exist = await Bookmark.findOne({ user: req.user.id, notice: req.params.noticeId });
    if (exist) return res.status(400).json({ success: false, message: 'Already bookmarked' });

    const bookmark = await Bookmark.create({ user: req.user.id, notice: req.params.noticeId });
    res.status(201).json({ success: true, data: bookmark });
  } catch (error) { next(error); }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user.id, notice: req.params.noticeId });
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
