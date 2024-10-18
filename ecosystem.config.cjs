module.exports = {
  apps: [
    {
      name: 'ssorte-Server',
      port: '3010',
      exec_mode: 'cluster',
      instances: 'max',
      script: './server/index.mjs'
    }
  ]
}