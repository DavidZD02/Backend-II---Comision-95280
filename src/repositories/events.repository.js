export default class EventsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }
}
