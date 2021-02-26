set -e

echo "TRAVIS_BRANCH: $TRAVIS_BRANCH"
echo "TRAVIS_PULL_REQUEST: $TRAVIS_PULL_REQUEST"
echo "TRAVIS_OS_NAME: $TRAVIS_OS_NAME"

npm ci
npm run lint && npm run build

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  if [ "$TRAVIS_OS_NAME" == "linux" ]; then
    echo "run docker"
    docker run --rm \
      --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
      -v ${PWD}:/project \
      -v ~/.cache/electron:/root/.cache/electron \
      -v ~/.cache/electron-builder:/root/.cache/electron-builder \
      electronuserland/builder:wine \
      /bin/bash -c "npm ci && npm run release --linux --win"
  else
    echo "build for mac"
    npm run release --mac
  fi
fi
