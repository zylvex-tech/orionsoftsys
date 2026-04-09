// PM2 ecosystem config — production process manager
// Usage:
//   pm2 start ecosystem.config.js --env production
//   pm2 restart orion-saas --update-env
//   pm2 logs orion-saas
//   pm2 monit

"use strict";

module.exports = {
  apps: [
    {
      name: "orion-saas",

      // Entry point relative to this file (repo root)
      script: "server/server.js",

      // Cluster mode: one worker per CPU core for better throughput
      instances: "max",
      exec_mode: "cluster",

      // Auto-restart on crash
      autorestart: true,
      watch: false,            // disable in production — use deploy instead
      max_memory_restart: "512M",

      // Environment — development (default)
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },

      // Environment — production (activated via --env production)
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // Log file paths (relative to repo root; directory is auto-created by PM2)
      error_file: "logs/pm2-err.log",
      out_file: "logs/pm2-out.log",
      log_file: "logs/pm2-combined.log",
      time: true,              // prepend timestamps to log lines

      // Graceful shutdown — let Express drain in-flight requests
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,

      // Wait before restarting after a crash (exponential back-off via PM2)
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
