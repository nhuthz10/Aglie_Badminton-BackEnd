import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
require("dotenv").config();

let checkUserId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.Cart.findOne({
        where: { userId: id },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewCartService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let checkUserExist = await checkUserId(data.userId);
        if (checkUserExist) {
          let cart = await db.Cart.findOne({
            where: { userId: data.userId },
          });
          resolve({
            errCode: 0,
            data: cart.cartId,
            message: "The user already has cart",
          });
        } else {
          const cartId = uuidv4();
          await db.Cart.create({
            cartId: cartId.slice(cartId.length - 10, cartId.length),
            userId: data.userId,
            totalPrice: 0,
          });
          resolve({
            errCode: 0,
            data: cartId.slice(cartId.length - 10, cartId.length),
            message: "Create a cart succeed",
          });
        }
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        resolve({
          errCode: -2,
          message: "Error foreign key",
        });
      } else {
        reject(error);
      }
    }
  });
};

let checkProductCart = (cartId, productId, sizeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Cart_Detail.findOne({
        where: { cartId: cartId, productId: productId, sizeId: sizeId },
      });
      if (product) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let AddProductToCartService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.userId ||
        !data.productId ||
        !data.sizeId ||
        !data.quantity ||
        !data.totalPrice
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        const cart = await db.Cart.findOne({
          where: { userId: data.userId },
        });
        let checkProductExist = await checkProductCart(
          cart.cartId,
          data.productId,
          data.sizeId
        );
        if (checkProductExist) {
          resolve({
            errCode: 2,
            message: "The product already has cart",
          });
        } else {
          await db.Cart_Detail.create({
            cartId: cart.cartId,
            productId: data.productId,
            sizeId: data.sizeId,
            quantity: data.quantity,
            totalPrice: data.totalPrice,
          });
          resolve({
            errCode: 0,
            message: "Add product to cart succeed",
          });
        }
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        resolve({
          errCode: -2,
          message: "Error foreign key",
        });
      } else {
        reject(error);
      }
    }
  });
};

let UpdateProductCartService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.cartId ||
        !data.productId ||
        !data.sizeId ||
        !data.quantity ||
        !data.totalPrice
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let cartDetail = await db.Cart_Detail.findOne({
          where: {
            cartId: data.cartId,
            productId: data.productId,
            sizeId: data.sizeId,
          },
          raw: false,
        });
        if (cartDetail) {
          cartDetail.cartId = data.cartId;
          cartDetail.productId = data.productId;
          cartDetail.sizeId = data.sizeId;
          cartDetail.quantity = data.quantity;
          cartDetail.totalPrice = data.totalPrice;
          await cartDetail.save();
          resolve({
            errCode: 0,
            message: "Update cart product succeed",
          });
        } else {
          resolve({
            errCode: 2,
            message: "Cart detail isn't exist",
          });
        }
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        resolve({
          errCode: -2,
          message: "Error foreign key",
        });
      } else {
        reject(error);
      }
    }
  });
};

let deleteProductCartService = (cartId, productId, sizeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!cartId || !productId || !sizeId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let productCart = await db.Cart_Detail.findOne({
          where: { cartId: cartId, productId: productId, sizeId: sizeId },
        });
        if (!productCart) {
          resolve({
            errCode: 2,
            message: "Product cart isn't exist",
          });
        } else {
          await db.Cart_Detail.destroy({
            where: { cartId: cartId, productId: productId, sizeId: sizeId },
          });
          resolve({
            errCode: 0,
            message: "Delete product cart succeed",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllProductCartService = (cartId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!cartId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let products = await db.Cart_Detail.findAll({
          where: { cartId: cartId },
          attributes: ["productId", "quantity", "totalPrice"],
          include: [
            {
              model: db.Product,
              as: "ProductData",
              attributes: ["image", "name", "price", "discount"],
            },
            {
              model: db.Size,
              as: "CartDetailSizeData",
              attributes: ["sizeId", "sizeName"],
            },
          ],
          raw: true,
          nest: true,
        });

        products = products.map((item) => {
          return {
            productId: item.productId,
            ...item.CartDetailSizeData,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            ...item.ProductData,
          };
        });

        let result = await Promise.all(
          products.map(async (item) => {
            let sizeData = await db.Product_Size.findOne({
              where: { sizeId: item.sizeId },
              attributes: ["quantity"],
            });
            return { ...item, quantitySize: sizeData };
          })
        );

        // let result = await Promise.all(
        //   products.map(async (item) => {
        //     let sizeData = await db.Product_Size.findAll({
        //       where: { productId: item.productId },
        //       attributes: ["quantity"],
        //       include: [
        //         {
        //           model: db.Size,
        //           as: "SizeData",
        //           attributes: ["sizeId", "sizeName"],
        //         },
        //       ],
        //       raw: true,
        //       nest: true,
        //     });

        //     return { ...item, sizeData: sizeData };
        //   })
        // );

        // result = result.map((item) => {
        //   return {
        //     productId: item.productId,
        //     name: item.name,
        //     image: item.image,
        //     sizeId: item.sizeId,
        //     sizeName: item.sizeName,
        //     price: item.price,
        //     discount: item.discount,
        //     quantity: item.quantity,
        //     totalPrice: item.totalPrice,
        //     sizeData: item.sizeData.map((size) => {
        //       return {
        //         quantity: size.quantity,
        //         ...size.SizeData,
        //       };
        //     }),
        //   };
        // });

        result = result.map((item) => {
          return {
            productId: item.productId,
            name: item.name,
            image: item.image,
            sizeId: item.sizeId,
            sizeName: item.sizeName,
            price: item.price,
            discount: item.discount,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            quantitySize: item.quantitySize.quantity,
          };
        });

        resolve({
          errCode: 0,
          data: result,
        });
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        resolve({
          errCode: -2,
          message: "Error foreign key",
        });
      } else {
        reject(error);
      }
    }
  });
};

module.exports = {
  createNewCartService,
  AddProductToCartService,
  getAllProductCartService,
  UpdateProductCartService,
  deleteProductCartService,
};
