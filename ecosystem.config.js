module.exports = [{
    script: 'build/www',
    name: 'servicio-backend-API',
    watch: false,
    watch_delay: 1000,
    ignore_watch: ["node_modules", ".git", "logs", "tmp", "*.log"], // Ignore unnecessary files
    watch: true,
  }, {
    script: 'worker.js',
    name: 'worker'
  }]