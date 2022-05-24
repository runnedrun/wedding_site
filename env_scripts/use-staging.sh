export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use staging
vercel env pull .env.local
cp ./private_configs/staging-runtimeconfig.json ./.runtimeconfig.json
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/staging-google-app-credentials.json"