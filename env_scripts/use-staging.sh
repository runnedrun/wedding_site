export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
cp ./private_configs/staging-config.env .env.local
cp ./private_configs/staging-runtimeconfig.json ./.runtimeconfig.json
firebase use staging
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/staging-google-app-credentials.json"