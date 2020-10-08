const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const isGet = type => type === 'GET'
const isPost = type => type === 'POST'
const apiUrl = `/api/blog`

// 统一的登录验证函数
const logincheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}


const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id
  const url = req.url
  const path = url.split('?')[0]

  //获取博客列表
  if (isGet(method) && path === `${apiUrl}/list`) {
    let author = req.query && req.query.author || ''
    const keyword = req.query && req.query.keyword || ''
    if (req.query.isadmin) {
      const loginCheckRes = logincheck(req)
      console.log('loginCheckRes--------->', loginCheckRes)
      if (loginCheckRes) {
        return loginCheckRes
      }
      author = req.session.username
    }
    const res = getList(author, keyword)
    return res.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (isGet(method) && path === `${apiUrl}/detail`) {
    return getDetail(id).then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建博客
  if (isPost(method) && path === `${apiUrl}/new`) {

    const loginCheckRes = logincheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }

    req.body.author = req.session.username
    console.log('req.sessio.username is', req.session.username)

    return newBlog(req.body).then(data => {
      return new SuccessModel(data)
    })
    
    
  }

  //更新 
  if (isPost(method) && path === `${apiUrl}/update`) {
    const loginCheckRes = logincheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }
    console.log('req.query', req.query)
    console.log('id', id)
    return updateBlog(id, req.body).then(data => {
      if (data) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新博客列表失败')
      }
    })
  }
  if (isPost(method) && path === `${apiUrl}/del`) {
    const loginCheckRes = logincheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }
    const author = req.session.username
    console.log(req.query.id)
    return delBlog(req.query.id, author).then(res => {
      if (res) {
        return new SuccessModel()
      }
      return new ErrorModel('删除失败')
    })
  }
}

module.exports = handleBlogRouter