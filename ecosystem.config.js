module.exports = {
    apps: [
        {
            name: 'solar-api',
            script: 'npm',
            args: 'run start:prod',
            cwd: './apps/api',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'solar-web',
            script: 'npm',
            args: 'start',
            cwd: './apps/web',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
