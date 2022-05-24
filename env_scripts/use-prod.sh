export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use prod
cp ./private_configs/prod-config.env .env.local
cp ./private_configs/prod-runtimeconfig.json ./.runtimeconfig.json
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/prod-google-app-credentials.json"
export GCLOUD_PROJECT="hylite-prod"