module.exports = function (plop) {
  plop.setGenerator('page', {
    description: 'application page logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'page name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/pages/{{name}}.html',
        templateFile: 'templates/index.html.hbs',
      },
      {
        type: 'add',
        path: '../src/styles/{{name}}.scss',
        templateFile: 'templates/styles.scss.hbs',
      },
    ],
  });

  plop.setGenerator('component', {
    description: 'application component logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/components/{{name}}.html',
        templateFile: 'templates/component.html.hbs',
      },
      {
        type: 'add',
        path: '../src/styles/{{name}}.scss',
        templateFile: 'templates/styles.scss.hbs',
      },
    ],
  });
};
