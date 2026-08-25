const UsersQuery = {
  findByAuth0Id: (auth0Id: string) => {
    return {
      query: `SELECT * FROM users WHERE auth0_id = $1`,
      values: [auth0Id],
    };
  },

  create: (
    auth0Id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    avatarUrl: string | null,
  ) => {
    return {
      query: `
        INSERT INTO users (auth0_id, email, first_name, last_name, avatar_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [auth0Id, email, firstName, lastName, avatarUrl],
    };
  },
};

export default UsersQuery;
