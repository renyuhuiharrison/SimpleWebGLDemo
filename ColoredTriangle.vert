  // 属性变量，从缓冲中获取数据
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }