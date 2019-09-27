import GameModel from '@/models/GameModel';

const gameFields = {id: 1, name: 'Test', field: {rows: [[1], [0]], columns: [[0], [1]]}};

describe('GameModel', () => {
  it('stores all properties from constructor', () => {
    const game = new GameModel(1, 'Test', [[1], [0]], [[0], [1]]);

    expect(game.id).toBe(1);
    expect(game.name).toBe('Test');
    expect(game.rows).toEqual([[1], [0]]);
    expect(game.columns).toEqual([[0], [1]]);
  });

  describe('fromJson', () => {
    it('throws an error when input parameter is not a string', () => {
      expect(() => {
        GameModel.fromJSON(123)
      }).toThrow(new Error('Game must be a JSON string'));
    });

    it('throws an error when input parameter is not a correct JSON string', () => {
      expect(() => {
        GameModel.fromJSON('{"name":"123')
      }).toThrow(new Error('Invalid JSON'));
    });

    it('throws an error when JSON does not contain an object', () => {
      expect(() => {
        GameModel.fromJSON('123456')
      }).toThrow(new Error('Game type is not an Object'));
    });

    it('throws an error when JSON does not contain "id"', () => {
      let game = Object.assign({}, gameFields);
      delete game.id;

      expect(() => {
        GameModel.fromJSON(JSON.stringify(game))
      }).toThrow(new Error('Game does not contain id'));
    });

    it('throws an error when JSON does not contain "name"', () => {
      let game = Object.assign({}, gameFields);
      delete game.name;

      expect(() => {
        GameModel.fromJSON(JSON.stringify(game))
      }).toThrow(new Error('Game does not contain name'));
    });

    describe('can contain "field" attribute', () => {
      it('throws an error when JSON the "field" attribute is not an object', () => {
        let game = Object.assign({}, gameFields);
        game.field = 123;

        expect(() => {
          GameModel.fromJSON(JSON.stringify(game))
        }).toThrow(new Error('Game field must be an object'));
      });

      it('throws an error when JSON does not contain "field.rows"', () => {
        let game = Object.assign({}, gameFields);
        game.field = {columns: [[1], [1]]};

        expect(() => {
          GameModel.fromJSON(JSON.stringify(game))
        }).toThrow(new Error('Game does not contain game field rows'));
      });

      it('throws an error when JSON does not contain "field.columns"', () => {
        let game = Object.assign({}, gameFields);
        game.field = {rows: [[1], [1]]};

        expect(() => {
          GameModel.fromJSON(JSON.stringify(game))
        }).toThrow(new Error('Game does not contain game field columns'));
      });
    });

    it('returns model with filled attributes (without field data)', () => {
      const game = new GameModel(gameFields.id, gameFields.name);
      expect(GameModel.fromJSON(JSON.stringify({id: gameFields.id, name: gameFields.name}))).toEqual(game);
    });

    it('returns model with filled attributes (with field data)', () => {
      const game = new GameModel(gameFields.id, gameFields.name, gameFields.field.rows, gameFields.field.columns);
      expect(GameModel.fromJSON(JSON.stringify(gameFields))).toEqual(game);
    });
  });
});