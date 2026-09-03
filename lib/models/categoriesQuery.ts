const CategoriesQuery = {
  retrieveAll: () => {
    return {
      query: `SELECT id, name, slug FROM categories ORDER BY name ASC`,
      values: [],
    };
  },
};

export default CategoriesQuery;