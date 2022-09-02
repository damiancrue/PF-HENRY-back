module.exports = {
  getProductsOptionalParameter: (name, active, Op) => {
    if (name && active)
      return {
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
          active: active,
        },
      };
    if (name)
      return {
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      };
    if (active)
      return {
        where: {
          active: active,
        },
      };
    return;
  },
};
