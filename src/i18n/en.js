export default Object.freeze({
  loading: 'Loading...',
  header: {
    home: 'Home',
    about: 'About',
    language: 'Language',
  },
  gamesList: {
    loading_error: 'Something went wrong and games list wasn\'t loaded... Try to refresh the page.',
    title: 'Choose your game!',
    gameState: {
      new_game: 'You have not played it yet',
      in_process: 'In Process',
      finished: 'Finished!'
    }
  },
  game: {
    loading_error: 'Something went wrong and game wasn\'t loaded... Try to refresh the page.',
    game_is_finished: 'Congratulations! Game is finished!',
    continue_game: 'Continue',
    go_to_games_list: 'Go to Games list',
    restart: 'Restart',
    keyboard: 'Keyboard'
  },
  about: {
    how_to_play: 'How to play',
    how_to_play_text: `<p>Wikipedia will tell you :-). <a href="https://en.wikipedia.org/wiki/Nonogram">Go to the Wikipedia's article.</a></p>`,
    about_project: 'About project',
    about_project_text: `
      <p>The project was made by Roman Petrov in order to study Vue.js (<a href="mailto:rpetrov.ru@gmail.com">rpetrov.ru@gmail.com</a>)</p>
      <p>Source code: <a href="https://github.com/igvnv/nonograms">on Gitlab</a>.</p>
    `
  },
  notFound: {
    message: 'Page not found...'
  }
});