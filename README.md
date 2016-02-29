# Gobbler

> Gobbler is an open-source project that allows users to receive updates whenever changes are made to the webpages they choose to follow.

## Team

  - __Product Owner__: Brian Fogg
  - __Scrum Master__: Ian deBoisblanc
  - __Development Team Members__: Jacques Uys, Alexxis Johnson

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> To use Gobbler, please visit www.gobblerweb.com.
>
> Click [here](https://github.com/UnfetteredCheddar/UnfetteredCheddar/blob/master/PRESS-RELEASE.md) for more information about the project.

## Requirements

- Meteor 1.2.1

## Development

### Installing Dependencies

From within the root directory:

```sh
curl https://install.meteor.com/ | sh
```

### Setting up the Dev Environment
Prior to creating the settings.json file, which is used to send email notifications, enter the command 
```sh
meteor
```
from within the "gobbler" file of the directory. Please note that email notifications will not work until the settings.json file is created.

Follow the format of the "settings_example.json" file to set up settings.json.

After creating the settings.json file, enter the following command from within the "gobbler" file of the directory:
```sh
meteor run --settings settings.json
```

### Roadmap

View the project roadmap [here](https://waffle.io/UnfetteredCheddar/UnfetteredCheddar)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
