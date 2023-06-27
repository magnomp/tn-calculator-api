import { axios } from './axios';

describe('auth', () => {
  let accessToken: string;
  beforeAll(async () => {
    const result = await axios.post('auth/login', {
      username: 'demo1@tn.com',
      password: '1234',
    });

    accessToken = result.data.accessToken;
  });

  it('Every operation must register a record on user history', async () => {
    console.log(accessToken);
    for (let i = 1; i <= 3; ++i) {
      await axios.post(
        'operations/addition',
        {
          a: 10,
          b: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    }

    const result = await axios.get('/records?skip=0&take=10', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(result.data.page).toHaveLength(3);
  });
});
