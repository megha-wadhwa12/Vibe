import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    BREVO_API_KEY: process.env.BREVO_API_KEY,
  },
});
