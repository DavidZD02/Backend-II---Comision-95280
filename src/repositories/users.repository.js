export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  async create(userData) {
    return await this.dao.create(userData);
  }
}
