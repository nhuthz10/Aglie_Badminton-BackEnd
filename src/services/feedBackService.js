import db from "../models/index";
require("dotenv").config();

let deleteFeedbackService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let feedback = await db.Feedback.findOne({
          where: { id: id },
        });
        if (!feedback) {
          resolve({
            errCode: 2,
            message: "Feedback isn't exist",
          });
        } else {
          await db.Feedback.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            message: "Delete feedback succeed",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateFeedbackService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let feedback = await db.Feedback.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (feedback) {
          feedback.description = data.description;
          feedback.rating = data.rating;

          await feedback.save();
          resolve({
            errCode: 0,
            message: "Update feebback succeed",
          });
        } else {
          resolve({
            errCode: 4,
            message: "Feedback isn't exist",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

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
  getAllFeedbackService,
  updateFeedbackService,
  deleteFeedbackService,
};
