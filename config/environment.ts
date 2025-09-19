const environment = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  //   TEST_API_URL: process.env.NEXT_PUBLIC_TEST_API_URL,
  //   AUTH_SECRET: process.env.NEXTAUTH_SECRET,
  //   JWT_EXPIRES_IN: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN,
  //   MIDTRANS_SNAP_URL: process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL,
  //   MIDTRANS_CLIENT_KEY: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
};

export default environment;
export type Environment = typeof environment;
export type EnvironmentKeys = keyof Environment;
