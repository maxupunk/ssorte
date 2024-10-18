module.exports = {
  apps: [
    {
      name: 'ssorte-Server',
      port: '3000',
      exec_mode: 'cluster',
      instances: 2,
      script: './server/index.mjs'
    }
  ]
}