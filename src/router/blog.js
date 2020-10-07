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
  // const id = req.query.id
  const url = req.url
  const path = url.split('?')[0]

  //获取博客列表
  if (isGet(method) && path === `${apiUrl}/list`) {
    const author = req.query && req.query.author || ''
    const keyword = req.query && req.query.keyword || ''
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
    // req.body.author = '庆儿'
    let data = ''
    return new Promise((resolve, reject) => {
      req.on('data', function (chunk) {
        // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
          data += chunk;
      })
      req.on('end', () => {
        console.log(typeof data);
        data = JSON.parse(data)
        data.author = '庆儿'
        req.body = data
        return newBlog(req.body).then(data => {
          resolve(new SuccessModel(data))
          return new SuccessModel(data)
        })
      })
    })
    
    
  }

  //更新
  if (isPost(method) && path === `${apiUrl}/update`) {
    let data = ''
    return new Promise((resolve, reject) => {
      req.on('data', chunk => {
        data += chunk
      })
      req.on('end', () => {
        data = JSON.parse(data)
        req.body = data
        return updateBlog(req.query.id, req.body).then(data => {
          resolve(new SuccessModel(data))
        })
      })
    })
  }
  if (isPost(method) && path === `${apiUrl}/del`) {
    let data = ''
    console.log(req.query.id)
    return delBlog(req.query.id, '庆儿').then(res => {
      if (res) {
        return new SuccessModel()
      }
      return new ErrorModel('删除失败')
    })
  }
}

module.exports = handleBlogRouter