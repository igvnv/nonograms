export default Object.freeze({
  header: {
    home: 'Главная',
    about: 'О проекте',
    language: 'Язык',
  },
  gamesList: {
    title: 'Выбери игру!',
    gameState: {
      new_game: 'Ты пока не играл в эту игру',
      in_process: 'В процессе',
      finished: 'Завершено!'
    }
  },
  game: {
    loading_error: 'Что-то пошло не так и не удалось загрузить игру... Попробуй перезагрузить страницу.',
    game_is_finished: 'Поздравляю! Игра завершена!',
    continue_game: 'Продолжить',
    go_to_games_list: 'Перейти к списку игр',
    game_is_loading: 'Загружаем игру...',
    restart: 'Начать заново',
    keyboard: 'Клавиатура'
  },
  about: {
    how_to_play: 'Как играть',
    how_to_play_text: `<p>Википедия расскажет тебе :-). <a href="https://ru.wikipedia.org/wiki/%D0%AF%D0%BF%D0%BE%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D0%BA%D1%80%D0%BE%D1%81%D1%81%D0%B2%D0%BE%D1%80%D0%B4">Перейти к странице на Википедии.</a></p>`,
    about_project: 'О проекте',
    about_project_text: `
      <p>Проект создан в целях изучения Vue.js Романом Петровым (<a href="mailto:rpetrov.ru@gmail.com">rpetrov.ru@gmail.com</a>)</p>
      <p>Исходный код: <a href="https://github.com/igvnv/nonograms">на Gitlab</a>.</p>
    `
  },
  notFound: {
    message: 'Страница не найдена...'
  }
});