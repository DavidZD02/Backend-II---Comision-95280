export default class EventsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getEvents() {
    return await this.repository.getAll();
  }
}
