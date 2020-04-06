npm init -y
# npm install babel-cli babel -preset-react-app
npm install --save-dev "babel-core@^7.0.0-0" -preset-react-app
npm install --save-dev "babel-core@^7.0.0-bridge.0" -preset-react-app
npx babel --watch src --out-dir js --presets react-app/prod 
