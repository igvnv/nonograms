class GameModel {
  /**
   * Model constructor.
   * @param {number} id
   * @param {String} name
   * @param {number[]?} rows
   * @param {number[]?} columns
   */
  constructor(id, name, rows, columns) {
    this.id = id;
    this.name = name;
    this.rows = rows;
    this.columns = columns;
  }

  /**
   * @param {String} json
   * @return {GameModel}
   */
  static fromJSON(json) {
    let data;

    if (typeof json != 'string') throw new Error('Game must be a JSON string');

    try {
      data = JSON.parse(json);
    }
    catch (e) {
      throw new Error('Invalid JSON');
    }

    if (typeof data != 'object') throw new Error('Game type is not an Object');
    if (!Object.keys(data).includes('id')) throw new Error('Game does not contain id');
    if (!Object.keys(data).includes('name')) throw new Error('Game does not contain name');

    if (Object.keys(data).includes('field')) {
      if (typeof data.field !== 'object') throw new Error('Game field must be an object');
      if (!Object.keys(data.field).includes('rows')) throw new Error('Game does not contain game field rows');
      if (!Object.keys(data.field).includes('columns')) throw new Error('Game does not contain game field columns');
      return new GameModel(data.id, data.name, data.field.rows, data.field.columns);
    }
    else {
      return new GameModel(data.id, data.name);
    }
  }

  /**
   * @param {object} document
   * @return {GameModel}
   */
  static fromFirestore(document) {
    if (typeof document != 'object') throw new Error('Game document must be an object');
    if (!document.id) throw new Error('Game document does not contain id');
    if (typeof document.data != 'function') throw new Error('Game document does not contain data method');

    const data = document.data();

    if (Object.keys(data).includes('field')) {
      let field;
      try {
        field = JSON.parse(data.field);
      }
      catch (e) {
        throw new Error('Invalid JSON');
      }

      if (typeof field !== 'object') throw new Error('Game field must be an object');
      if (!Object.keys(field).includes('rows')) throw new Error('Game does not contain game field rows');
      if (!Object.keys(field).includes('columns')) throw new Error('Game does not contain game field columns');

      return new GameModel(parseInt(document.id), data.name, field.rows, field.columns);
    }
    else {
      return new GameModel(parseInt(document.id), data.name);
    }
  }
}

export default GameModel;