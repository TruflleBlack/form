/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/token',
        destination: 'http://localhost/undangansistem/backend/api/token.php',
      },
      {
        source: '/api/submit_form',
        destination: 'http://localhost/undangansistem/backend/api/submit_form.php',
      },
      {
        source: '/api/update_form',
        destination: 'http://localhost/undangansistem/backend/api/update_form.php',
      },
      {
        source: '/api/cek_token',
        destination: 'http://localhost/undangansistem/backend/api/cek_token.php',
      },
      {
        source: '/api/debug',
        destination: 'http://localhost/undangansistem/backend/api/debug.php',
      },
      {
        source: '/api/create_tokens',
        destination: 'http://localhost/undangansistem/backend/api/create_tokens_table.php',
      },
    ];
  },
};
