# loot-content-analysis

A cli tool for analyzing [loot](https://github.com/joakin/loot) content and
a browser webapp for visualizing the reports.

[Live report version](http://chimeces.com/loot-content-analysis/)

## Deps

* node.js >= 4.0
* npm >= 3.0

## Usage

1. Clone this repo somewhere `git clone https://github.com/joakin/loot-content-analysis`
2. cd into the folder and install dependencies `npm install`
3. Link the package to have it available as a globally installed npm module
  1. `npm link .`
4. Run it globally from anywhere by executing `loot-content-analysis`.

### Developing and visualizing the report

```bash
cd loot-content-analysis
cd ./examples/
rm -rf output/* && SERVER=http://localhost:7002 loot-content-analysis -c config.yml -d output
# after it ends...
npm start
# Open localhost:3000 in the browser
```

## Options

Run `loot-content-analysis` to see usage.
