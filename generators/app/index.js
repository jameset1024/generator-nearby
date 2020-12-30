'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const axios = require('axios');
const fs = require('fs');
const fsExtra = require('fs-extra');
const admZip = require('adm-zip');
const { execSync } = require('child_process');

const githubDownoad = 'https://codeload.github.com/laravel/laravel/zip/';
const laravelInformation = 'https://api.github.com/repos/laravel/laravel/releases/latest';


module.exports = class extends Generator {

  prompting() {
    //User greeting
    this.log(
      yosay(`Welcome to the ${chalk.red('Nearby Laravel')} generator!`)
    );

    //Prompts
    const prompts = [
      {
        type: 'input',
        name: 'project',
        message: 'What is the name of this project?',
        default: "Laravel"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  async writing() {

    try {

      //Check if the templates folder exists
      if(!fs.existsSync(__dirname + '/templates')){
          fs.mkdirSync(__dirname + '/templates');
      }

      //Clears out the template directory to avoid errors
      await fsExtra.emptyDir(__dirname + '/templates');

      //Get the current version of laravel and download the zip
      let data = await axios.get(laravelInformation);
      let zip = await axios.get(githubDownoad + data.data.target_commitish, {responseType: 'arraybuffer'});

      //Write the zip file to local
      fs.writeFileSync(__dirname + '/templates/laravel.zip', zip.data);

      //Unzip the laravel zip file
      let zipData = new admZip(__dirname + '/templates/laravel.zip');
      zipData.extractAllTo(__dirname + '/templates/', true);

      //Delete the laravel.zip file
      fs.unlinkSync(__dirname + '/templates/laravel.zip');

      //Find the directory that was extracted
      let src;
      const dir = fs.readdirSync(__dirname + '/templates');
      for (const file of dir) {
        if (fs.lstatSync(__dirname + '/templates/' + file)) {
          src = __dirname + '/templates/' + file;
        }
      }

      //Copy the contents of the found directory into the main templates directory, then delete the directory
      if (src) {
        fsExtra.copySync(src, __dirname + '/templates');
        fs.rmdirSync(src, {recursive: true});
      }

      //Copy everything from the templates directory to the project root
      this.fs.copy(
        this.templatePath('**/{.,}*'),
        this.destinationPath()
      );

      //Move the environment files to the project root
      this.fs.copy(
        this.templatePath('./../environment/**/{.,}*'),
        this.destinationPath()
      );

      //Copy the environment file to the project root
      this.fs.copyTpl(
        this.templatePath('./../tmpl/.env.example'),
        this.destinationPath('.env'),
        { project: this.props.project}
      );

      //Copy the package file to the project root
      this.fs.copyTpl(
        this.templatePath('./../tmpl/_package.json'),
        this.destinationPath('package.json'),
        { project: this.props.project}
      );

      //Copy the template file over
      this.fs.delete(this.destinationPath('resources/views/welcome.blade.php'));
      this.fs.copy(
        this.templatePath('./../layout/welcome.blade.php'),
        this.destinationPath('resources/views/welcome.blade.php')
      )

      //Remove unnecessary files
      this.fs.delete(this.destinationPath('docker-compose.yml'));
      this.fs.delete(this.destinationPath('webpack.mix.js'));

    }catch(e){
      this.log('There was an error');
      this.log(e);
    }
  }

  install() {
    this.log(`${chalk.green('Installing node packages.')}`);
    execSync('npm install');

    //Setting up base asset files
    this.log(`${chalk.green('Creating base asset files.')}`);
    execSync('rm -f resources/css/* && rm -f resources/js/* && touch resources/css/main.scss && touch resources/js/main.js');

    //Build the composer directory and generate the laravel key
    this.log(`${chalk.green('Installing composer packages.')}`);
    execSync('composer install && php artisan key:generate');

    //Start building docker images
    this.log(`${chalk.green('Build Docker Images')}`);
    execSync('chmod +x build/docker/nearby && ./build/docker/nearby -f build/docker/docker-compose.yaml build');

    //Log completion message
    this.log(`${chalk.green('All done. Happy coding!')}`);
  }
};
