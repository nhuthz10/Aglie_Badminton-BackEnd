import db from "../models/index";
require("dotenv").config();

let getAllFeedbackService = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let feedbacks = await db.Feedback.findAll({
          where: { productId: productId },
          attributes: {
            exclude: ["createdAt"],
          },
          include: [
            {
              model: db.User,
              as: "UserFeedbackData",
              attributes: ["userName", "email", "avatar"],
            },
          ],
          raw: true,
          nest: true,
        });
        feedbacks = feedbacks.map((item) => {
          return {
            id: item.id,
            userId: item.userId,
            userName: item.UserFeedbackData.userName,
            email: item.UserFeedbackData.email,
            avatar: item.UserFeedbackData.avatar,
            productId: item.productId,
            description: item.description,
            rating: item.rating,
            updatedAt: item.updatedAt,
          };
        });
        resolve({
          errCode: 0,
          data: feedbacks,
          message: "Get all feedback succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewFeedBackService,
  getAllFeedbackService,
  updateFeedbackService,
  deleteFeedbackService,
};
