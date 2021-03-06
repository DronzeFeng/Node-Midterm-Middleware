const errorHandle = require('../services/errorHandle');
const successHandle = require('../services/successHandle');
const postModel = require('../models/posts');
const userModel = require('../models/users');
const posts = {
  async getPosts(req, res, next) {
    // ASC  遞增(由小到大，由舊到新) createdAt ;
    // DESC 遞減(由大到小、由新到舊) -createdAt
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await postModel
      .find(q)
      .populate({
        path: 'user', // Path of collection:users
        select: 'name photo ',
      })
      .sort(timeSort);

    successHandle(res, post);
  },
  async createPost(req, res, next) {
    const { body } = req;
    let userId = '';

    if (body.user === '') {
      return errorHandle(400, '查無此使用者ID', next);
    } else {
      userId = await userModel.findById(body.user).exec();
    }

    if (userId) {
      if (body.content !== '') {
        const newPost = await postModel.create({
          content: body.content,
          image: body.image,
          createdAt: body.createdAt,
          user: body.user,
          likes: body.likes,
        });

        successHandle(res, newPost);
      } else {
        errorHandle(400, '請填寫 Content 資料', next);
      }
    } else {
      errorHandle(400, '查無此使用者ID', next);
    }
  },
  async deleteAllPosts(req, res, next) {
    const posts = await postModel.deleteMany({});

    successHandle(res, posts);
  },
  async deleteOnePost(req, res, next) {
    const id = req.params.id;

    postModel.findByIdAndDelete(id).then(async (data) => {
      const posts = await postModel.find();

      if (data !== null) {
        successHandle(res, posts);
      } else {
        errorHandle(400, '查無此貼文ID', next);
      }
    });
  },
  async patchOnePost(req, res, next) {
    const { body } = req;
    const id = req.params.id;
    let userId = '';

    if (body.user === '') {
      return errorHandle(400, '查無此使用者ID', next);
    } else {
      userId = await userModel.findById(body.user).exec();
    }

    if (body.content !== '') {
      postModel
        .findByIdAndUpdate(id, body, { new: true })
        .then(async (data) => {
          const posts = await postModel.find();

          if (userId) {
            if (data !== null) {
              successHandle(res, posts);
            } else {
              errorHandle(400, '查無此貼文ID', next);
            }
          } else {
            errorHandle(400, '查無此使用者ID', next);
          }
        })
        .catch(() => {
          errorHandle(400, '查無此貼文ID', next);
        });
    } else {
      errorHandle(400, '請填寫 Content 資料', next);
    }
  },
};

module.exports = posts;
