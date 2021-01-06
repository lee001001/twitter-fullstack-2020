const helpers = require('../_helpers')
const db = require('../models')
const { User } = db

module.exports = {
  authenticatedUser: async (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      const role = helpers.getUser(req).role || ""
      if (role === "") {
        update = await User.findByPk(helpers.getUser(req).id)
          .then(user => {
            return user.update({
              login: true,
              logintimeAt: new Date()
            })
          })
        return next()
      }
      // req.flash('error_messages', '你沒有權限進入，請從後台登入')
      // req.logout()
      // return res.redirect('admin/signin')
    }
    return res.redirect('/signin')
  },

  authenticatedAdmin: (req, res, next) => {

    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      // req.flash('error_messages', '你沒有權限進入，請從前台登入')
      // req.logout()
      // return res.redirect('/signin')
    }
    return res.redirect('/admin/signin')
  },

  beSigned: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return res.redirect('/admin/tweets')
      } else {
        return res.redirect('/tweets')
      }
    } else {
      return next()
    }
  },

  isOwnProfile: (req, res, next) => {
    const userId = res.locals.user.id.toString() //user id of the authenticated user
    const profileUserId = req.params.id // user id of the user profile
    res.locals.isOwnProfile = userId === profileUserId ? true : false
    next()
  },
  editOwnProfile: (req, res, next) => {
    const userId = res.locals.user.id.toString() //user id of the authenticated user
    const profileUserId = req.params.id // user id of the user profile
    if (userId === profileUserId) {
      return next()
    } else {
      req.flash('error_messages', '無權訪問該頁面')
      res.redirect(`/users/${profileUserId}`)
    }
  }
}