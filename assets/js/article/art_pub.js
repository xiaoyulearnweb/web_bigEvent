$(function() {
  var layer = layui.layer
  var form = layui.form

  initCate()
    // 初始化富文本编辑器
  initEditor()

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 调用模板引擎,渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
          // 一定要调用 form.render() 方法,重新渲染ui结构
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 为选择封面绑定点击事件
  $('#btnChooseImage').on('click', function() {
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件,获取用户选择的文件列表
  $('#coverFile').on('change', function(e) {
    // 获取到文件的列表数组
    var files = e.target.files
    if (files.length === 0) {
      return layer.msg('请选择文件')
    }
    var file = e.target.files[0]
    var newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })


  // 定义文章的发布状态
  var art_state = '已发布'

  // 为存为草稿按钮绑定点击事件
  $('#btnSave2').on('click', function() {
    art_state = '草稿'
  })

  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function(e) {
    // 1.阻止表单默认提交行为
    e.preventDefault();
    // 2.基于 form 表单,快速创建一个 formData 对象
    var fd = new FormData($(this)[0])
      // 3.向 formData 对象中添加文章的发布状态
    fd.append('state', art_state)
      // 4.将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象,存储到 fd 中
        fd.append('cover_img', blob)
          // 6.发起请求,将内容提交到服务器
        publishArticle(fd)
      })
  })

  // 发布文章
  function publishArticle(data) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: data,
      // 注意: 如果向服务器提交的是 FormData 格式的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('发布文章成功!')
        location.href = '/article/art_list.html'
      }
    })
  }
})