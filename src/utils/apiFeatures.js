function apiFeaturesPlugin(schema, options = {}) {
  const searchFields = options.searchFields || ["name", "description"];

  schema.statics.apiFeatures = function (reqQuery = {}) {
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "-createdAt",
      select = "",
      populate = "",
      ...filters
    } = reqQuery;

    page = Number(page);
    limit = Number(limit);
    //convert filters
    const mongoFilters = {};
    for (let key in filters) {
      if (key.includes("[")) {
        const parts = key.split(/\[|\]/).filter(Boolean);
        const field = parts[0];
        const operator = "$" + parts[1];
        if (!mongoFilters[field]) mongoFilters[field] = {};
        mongoFilters[field][operator] = isNaN(filters[key])
          ? filters[key]
          : Number(filters[key]);
      } else {
        mongoFilters[key] = isNaN(filters[key])
          ? filters[key]
          : Number(filters[key]);
      }
    }

    let query = this.find(mongoFilters);
    //search
    if (search) {
      const orConditions = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
      //merge filters with search
      query = query.find({ $or: orConditions, ...mongoFilters });
    }
    //sort
    if (sort) query = query.sort(sort);

    // select
    if (select) query = query.select(select);

    // populate
    if (populate) query = query.populate(populate);

    // pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // execApiFeatures
    query.execApiFeatures = async function () {
      const total = await this.model.countDocuments(this.getQuery());
      const pages = Math.ceil(total / limit);
      const data = await query.exec();
      return {
        total,
        page,
        pages,
        isNext: page < pages,
        isPrevious: page > 1,
        data,
      };
    };

    return query;
  };
}

module.exports = apiFeaturesPlugin;
