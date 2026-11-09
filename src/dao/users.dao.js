import User from "../models/User.js";

export default class UsersDAO {
  async getByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async create(userData) {
    return await User.create(userData);
  }
}