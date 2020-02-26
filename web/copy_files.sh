src="./public"
dest="dist"

rm -r $dest/*

echo "copying files..."

cp $src/index.html $dest/index.html
mkdir $dest/js

cp -r $src/js/vendor $dest/js/vendor
cp -r $src/webfonts $dest/webfonts
cp -r $src/css $dest/css
cp -r $src/font $dest/font

echo "files copied..."