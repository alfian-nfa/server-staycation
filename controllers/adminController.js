const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Member = require("../models/Member");
const Activity = require("../models/Activity");
const Users = require("../models/Users");
const Booking = require("../models/Booking");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Staycation | Login",
        });
      } else {
        redirectAdminPage(res, "dashboard");
      }
    } catch (error) {
      redirectAdminPage(res, "signin");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await Users.findOne({ username: username });

      if (!user) {
        req.flash("alertMessage", "Username not found!");
        req.flash("alertStatus", "danger");
        redirectAdminPage(res, "signin");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Wrong password. Try again or click Forgot Password for resetting.");
        req.flash("alertStatus", "danger");
        redirectAdminPage(res, "signin");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      };

      redirectAdminPage(res, "dashboard");
    } catch (error) {
      redirectAdminPage(res, "signin");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    redirectAdminPage(res, "signin");
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Staycation | Dashboard",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {
      redirectAdminPage(res, "dashboard");
    }
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Staycation | Category",
        user: req.session.user,
      });
    } catch (error) {
      redirectAdminPage(res, "category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Category added successful!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", `${category.name} changed to ${name} successful!`);
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await Category.deleteOne({ _id: id });
      req.flash("alertMessage", `${category.name} deleted successful!`);
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.status(500).send("Internal Server Error");
      redirectAdminPage(res, "category");
    }
  },

  viewBank: async (req, res) => {
    const bank = await Bank.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/bank/view_bank", {
      title: "Staycation | Bank",
      bank,
      alert,
      user: req.session.user,
    });
  },

  addBank: async (req, res) => {
    try {
      const { name, bankName, accountNumber } = req.body;
      await Bank.create({
        name,
        bankName,
        accountNumber,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Category added successful!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, bankName, accountNumber } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        await bank.save();
        req.flash("alertMessage", `Update successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, "bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", `Update successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, "bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await Bank.deleteOne({ _id: id });
      req.flash("alertMessage", `${bank.bankName} - ${bank.accountNumber} deleted successful!`);
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.status(500).send("Internal Server Error");
      redirectAdminPage(res, "bank");
    }
  },

  viewBooking: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const booking = await Booking.find().populate("memberId").populate("bankId");

      res.render("admin/booking/view_booking", {
        title: "Staycation | Booking",
        user: req.session.user,
        booking,
        alert,
      });
    } catch (error) {
      redirectAdminPage(res, "booking");
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const booking = await Booking.findOne({ _id: id }).populate("memberId").populate("bankId");

      res.render("admin/booking/detail_booking", {
        title: "Staycation | Detail Booking",
        user: req.session.user,
        booking,
        alert,
      });
    } catch (error) {
      redirectAdminPage(res, "booking");
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Accept";
      await booking.save();
      req.flash("alertMessage", "Payment Confirmation Success!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `booking/${id}`);
    } catch (error) {
      redirectAdminPage(res, `booking/${id}`);
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Reject";
      await booking.save();
      req.flash("alertMessage", "Payment Rejection Success!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `booking/${id}`);
    } catch (error) {
      redirectAdminPage(res, `booking/${id}`);
    }
  },

  viewItem: async (req, res) => {
    try {
      const item = await Item.find().populate({ path: "imageId", select: "id imageUrl" }).populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Staycation | Item",
        item,
        category,
        alert,
        action: "view",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { title, price, country, city, about, categoryId } = req.body;
      if (req.files.length === 0) {
        throw new Error("No images uploaded");
      }
      const category = await Category.findOne({ _id: categoryId });
      if (!category) {
        throw new Error("Category not found");
      }
      const images = [];
      for (const file of req.files) {
        const image = await Image.create({ imageUrl: `images/${file.filename}` });
        images.push(image._id);
      }
      const newItem = await Item.create({
        categoryId,
        title,
        price,
        country,
        city,
        description: about,
        imageId: images,
      });
      // console.log(newItem._id);
      category.itemId.push({ _id: newItem._id });
      await category.save();
      // !! cannot push item Id !! need to fix //
      req.flash("alertMessage", "Item added successfully!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "item");
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({ path: "imageId", select: "id imageUrl" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Staycation | Show Image Item",
        item,
        alert,
        action: "show image",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },
  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({ path: "imageId", select: "id imageUrl" }).populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Staycation | Edit Item",
        item,
        category,
        alert,
        action: "",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, country, city, about, categoryId } = req.body;
      const item = await Item.findOne({ _id: id }).populate({ path: "imageId", select: "id imageUrl" }).populate({ path: "categoryId", select: "id name" });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", `${title} updated successfully!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, "item");
      } else {
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", `${title} updated successfully!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, "item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");

      for (let i = 0; i < item.imageId.length; i++) {
        const imageDoc = item.imageId[i];
        const image = await Image.findOne({ _id: imageDoc._id });

        fs.unlink(path.join(`public/${image.imageUrl}`));
        await Image.deleteOne({ _id: image._id });
      }
      await Item.deleteOne({ _id: item._id });
      req.flash("alertMessage", "Item deleted successfully!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, "item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, "item");
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const feature = await Feature.find();
      const activity = await Activity.find();
      res.render("admin/item/detail_item/view_detail_item", {
        title: "Staycation | Detail Item",
        itemId,
        feature,
        activity,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show_detail_item/${itemId}`);
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Feature added successful!");
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMessage", "Feature added successful!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    const feature = await Feature.findOne({ _id: id });
    try {
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", `Update successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMessage", `Feature updated successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;

    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });

      // Filter the featureId array to remove the specified id
      item.featureId = item.featureId.filter((item) => item.toString() !== id);
      await item.save();

      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await Feature.deleteOne({ _id: id });

      req.flash("alertMessage", `${feature.name} deleted successfully!`);
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },

  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Activity added successful!");
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash("alertMessage", "Activity added successful!");
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    const activity = await Activity.findOne({ _id: id });
    try {
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMessage", `Update successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertMessage", `Feature updated successful!`);
        req.flash("alertStatus", "success");
        redirectAdminPage(res, `item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;

    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });

      // Filter the activityId array to remove the specified id
      item.activityId = item.activityId.filter((item) => item.toString() !== id);
      await item.save();

      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await Activity.deleteOne({ _id: id });

      req.flash("alertMessage", `${activity.name} deleted successfully!`);
      req.flash("alertStatus", "success");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      redirectAdminPage(res, `item/show-detail-item/${itemId}`);
    }
  },
};

function redirectAdminPage(res, page) {
  res.redirect(`/admin/${page}`);
}
