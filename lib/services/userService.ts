import { query } from "@/lib/database/db";
import UsersQuery from "@/lib/models/usersQuery";

export const syncUser = async (auth0User: {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}) => {
  try {
    if (!auth0User.email) {
      return { success: false, message: "No email on Auth0 user." };
    }

    const { query: findSql, values: findValues } = UsersQuery.findByAuth0Id(
      auth0User.sub,
    );
    const existing = await query(findSql, findValues);

    if (existing.rows.length > 0) {
      return {
        success: true,
        message: "User already exists",
        user: existing.rows[0],
      };
    }

    const { query: createSql, values: createValues } = UsersQuery.create(
      auth0User.sub,
      auth0User.email,
      auth0User.given_name ?? null,
      auth0User.family_name ?? null,
      auth0User.picture ?? null,
    );
    const created = await query(createSql, createValues);

    return { success: true, message: "User created", user: created.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
