import brandService from "../services/brandService";

let handleGetAllBrand = async (req, res) => {
  try {
    let { limit, page, sort, name, pagination } = req.query;
    let message = await brandService.getAllBrandService(
      +limit,
      +page,
      sort,
      name,
      pagination
    );
    if (message.errCode === 0) return res.status(200).json(message);
    else return res.status(400).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from the server!!!",
    });
  }
};

module.exports = {
  handleGetAllBrand,
};
