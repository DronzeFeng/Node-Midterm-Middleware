const errorHandle = require('../services/errorHandle');
const successHandle = require('../services/successHandle');
const postModel = require('../models/posts');
const posts = {
  async getPosts(req, res) {
    // asc 遞增(由小到大，由舊到新) createdAt ;
    // desc 遞減(由大到小、由新到舊) "-createdAt"
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
  async createPost(req, res) {
    try {
      const { body } = req;

      if (body !== undefined) {
        const newPost = await postModel.create({
          content: body.content,
          image: body.image,
          createdAt: body.createdAt,
          user: body.user,
          likes: body.likes,
        });

        successHandle(res, newPost);
      } else {
        errorHandle(res);
      }
    } catch (error) {
      errorHandle(res, error);
    }
  },
  async deleteAllPosts(req, res) {
    const posts = await postModel.deleteMany({});

    successHandle(res, posts);
  },
  async deleteOnePost(req, res, id) {
    postModel
      .findByIdAndDelete(id)
      .then(async (data) => {
        const posts = await postModel.find();

        if (data === null) {
          errorHandle(res);
        } else {
          successHandle(res, posts);
        }
      })
      .catch((error) => {
        errorHandle(res, error);
      });
  },
  async patchOnePost(req, res, id) {
    try {
      const { body } = req;

      if (body !== undefined && body.content !== '') {
        postModel
          .findByIdAndUpdate(id, body, { new: true })
          .then(async (data) => {
            const posts = await postModel.find();

            if (data === null) {
              errorHandle(res);
            } else {
              successHandle(res, posts);
            }
          })
          .catch((error) => {
            errorHandle(res, error);
          });
      } else {
        errorHandle(res);
      }
    } catch (error) {
      errorHandle(res, error);
    }
  },
};

module.exports = posts;
