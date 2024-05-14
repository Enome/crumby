echo "===== BUILDING ====="

npm run build

echo "===== Creating docker image ====="

read -p "Enter version: " VERSION
docker build --platform=linux/amd64 -t enome/crumby:$VERSION .
docker push enome/crumby:$VERSION

git tag $VERSION
