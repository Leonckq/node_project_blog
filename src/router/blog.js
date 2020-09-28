const isGet = type => type === 'GET'
const isPost = type => type === 'POST'
const apiUrl = `/api/blog`
const handleBlogRouter = (req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]

  //获取博客列表
  if (isGet(method) && path === `${apiUrl}/list`) {
    return {
      msg: '博客列表'
    }
  }

  // 获取博客详情
  if (isGet(method) && path === `${apiUrl}/detail`) {
    return {
      msg: '博客详情'
    }
  }

  // 新建博客
  if (isPost(method) && path === `${apiUrl}/new`) {
    return {
      msg: '新建'
    }
  }

  //更新
  if (isPost(method) && path === `${apiUrl}/update`) {
    return {
      msg: '更新'
    }
  }
  if (isPost(method) && path === `${apiUrl}/del`) {
    return {
      msg: '删除'
    }
  }
}

module.exports = handleBlogRouter