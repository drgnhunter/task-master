class BaseModel {
  

  // Generic CREATE accepting dynamic key-value pairs
  async create(data) {
    try {
      // 1. Extract column names and values dynamically
      const keys = Object.keys(data);
      const values = Object.values(data);

      if (keys.length === 0) {
        throw new Error('No data provided to create record.');
      }

      // 2. Generate placeholders (?, ?, ?) based on the number of keys
      const columns = keys.join(', '); // e.g., "title, description, status"
      const placeholders = keys.map(() => '?').join(', '); // e.g., "?, ?, ?"

      // 3. Construct and execute the parameterized query
      const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await db.query(sql, values);

      // 4. Return the newly created record ID alongside the data
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error(`[${this.tableName}] Create Error:`, error);
      throw error;
    }
  }
}

module.exports = BaseModel;