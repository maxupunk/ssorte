module.exports = {
  apps: [
    {
      name: 'ssorte-Server',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'MAX',
      script: './.output/server/index.mjs'
    }
  ]
}