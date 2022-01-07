$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的Id
    state: '', // 文章的发布状态
  }

  initTable()
  initCate()

  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表数据失败!')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
          // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }


  // 初始化文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类列表失败!')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
          // 通过 layui 重新渲染表单区域的ui结构
        form.render()
      }
    })
  }


  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function(e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
      // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
      // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })


  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox', // 分页容器的id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 默认选中的页码
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式,有两种:
      // 1.点击页码的时候,会触发
      // 2.只要调用了 laypage.render() 方法就会触发
      jump: function(obj, first) {
        // 点击哪一页
        // console.log(obj.curr);
        // 把最新的页码值,赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
      }
    });
  }


  // 通过代理的行为,为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function() {
    var length = $('.btn-delete').length
    var id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('删除文章成功!')
            // 减页码操作
          if (length === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    })
  })
})