module.exports = [{
    script: 'bin/www',
    name: 'servicio-backend-API',
    watch: true,
    watch_delay: 1000,
    ignore_watch: ["node_modules", ".git", "logs", "tmp", "*.log"], // Ignore unnecessary files
    watch: true,
    "watch_options": {
        usePolling: true
    },
  }
]