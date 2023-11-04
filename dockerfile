# 使用官方 Node.js 14 作为基础镜像
FROM node:14
# 定义在容器内的工作目录
WORKDIR /usr/src/app
# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./
# 安装项目依赖
RUN npm install
# 将项目源代码复制到工作目录
COPY . .
# 暴露容器的 8080 端口
EXPOSE 3000
# 定义容器启动时执行的命令
CMD [ "node", "bin/www" ]