export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
cp ./private_configs/demo-config.env .env.local
cp ./private_configs/demo-runtimeconfig.json ./.runtimeconfig.json
firebase use staging
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/demo-google-app-credentials.json"
export FIRESTORE_EMULATOR_HOST="localhost:8080"
export GCLOUD_PROJECT="demo-hylite"
