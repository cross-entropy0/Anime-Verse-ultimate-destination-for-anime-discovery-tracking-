const Comment = require('../models/Comment');

// @desc    Get comments for anime
// @route   GET /api/comments/anime/:animeId
// @access  Public
const getAnimeComments = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const { sort = 'recent', page = 1, limit = 20 } = req.query;

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get top-level comments (no parent)
    const skip = (page - 1) * limit;
    const totalComments = await Comment.countDocuments({ animeId, parentId: null });
    
    let comments = await Comment.find({ animeId, parentId: null })
      .populate('userId', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // If sorting by likes, do it manually
    if (sort === 'liked') {
      comments = await Comment.find({ animeId, parentId: null })
        .populate('userId', 'username avatar');
      comments = comments.sort((a, b) => b.likes.length - a.likes.length)
        .slice(skip, skip + parseInt(limit));
    }

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const commentObj = comment.toObject();
        
        // Get replies
        const replies = await Comment.find({ parentId: comment._id })
          .populate('userId', 'username avatar')
          .sort({ createdAt: 1 });

        commentObj.replies = replies.map(reply => {
          const replyObj = reply.toObject();
          if (req.user) {
            replyObj.isLikedByCurrentUser = reply.likes.some(
              userId => userId.toString() === req.user._id.toString()
            );
          }
          return replyObj;
        });

        // Add isLikedByCurrentUser for comment
        if (req.user) {
          commentObj.isLikedByCurrentUser = comment.likes.some(
            userId => userId.toString() === req.user._id.toString()
          );
        }

        return commentObj;
      })
    );

    res.json({
      success: true,
      data: commentsWithReplies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalResults: totalComments,
        hasNextPage: page * limit < totalComments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for manga
// @route   GET /api/comments/manga/:mangaId
// @access  Public
const getMangaComments = async (req, res, next) => {
  try {
    const { mangaId } = req.params;
    const { sort = 'recent', page = 1, limit = 20 } = req.query;

    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const totalComments = await Comment.countDocuments({ mangaId, parentId: null });
    
    let comments = await Comment.find({ mangaId, parentId: null })
      .populate('userId', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    if (sort === 'liked') {
      comments = await Comment.find({ mangaId, parentId: null })
        .populate('userId', 'username avatar');
      comments = comments.sort((a, b) => b.likes.length - a.likes.length)
        .slice(skip, skip + parseInt(limit));
    }

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const commentObj = comment.toObject();
        
        const replies = await Comment.find({ parentId: comment._id })
          .populate('userId', 'username avatar')
          .sort({ createdAt: 1 });

        commentObj.replies = replies.map(reply => {
          const replyObj = reply.toObject();
          if (req.user) {
            replyObj.isLikedByCurrentUser = reply.likes.some(
              userId => userId.toString() === req.user._id.toString()
            );
          }
          return replyObj;
        });

        if (req.user) {
          commentObj.isLikedByCurrentUser = comment.likes.some(
            userId => userId.toString() === req.user._id.toString()
          );
        }

        return commentObj;
      })
    );

    res.json({
      success: true,
      data: commentsWithReplies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalResults: totalComments,
        hasNextPage: page * limit < totalComments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { animeId, mangaId, text, parentId } = req.body;

    const comment = await Comment.create({
      userId: req.user._id,
      animeId,
      mangaId,
      text,
      parentId: parentId || null
    });

    const populated = await Comment.findById(comment._id).populate('userId', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not the author'
      });
    }

    comment.text = text;
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('userId', 'username avatar');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not the author'
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentId: id });

    // Delete the comment itself
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/unlike a comment
// @route   POST /api/comments/:id/like
// @access  Private
const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnimeComments,
  getMangaComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment
};
