SHORTNAME=siteshaker
export SHORTNAME=$SHORTNAME
rm  $SHORTNAME*.xpi
rm -rf $SHORTNAME
mkdir $SHORTNAME
cd $SHORTNAME
rsync -r --exclude=.svn --exclude-from=../excludefile.txt ../* .
#VERSION=`grep "em:version" install.rdf | sed -e 's/[ \t]*em:version=//;s/"//g'`
VERSION=`grep "em:version" install.rdf | sed -e 's/[ \t]*<em:version>//;s/<\/em:version>//g'`
export VERSION=$VERSION
perl -pi -e 's/0.0.0/$ENV{"VERSION"}/gi' bootstrap*.js
rm bootstrap*.js.bak
zip -r -D ../$SHORTNAME-$VERSION.xpi *
cd ..
rm -rf $SHORTNAME
~/androidsdk/platform-tools/adb push $SHORTNAME-$VERSION.xpi /mnt/sdcard/$SHORTNAME-$VERSION.XPI
~/androidsdk/platform-tools/adb shell am start -a android.intent.action.VIEW \
                            -c android.intent.category.DEFAULT \
                            -d file:///mnt/sdcard/$SHORTNAME-$VERSION.xpi \
                            -n org.mozilla.firefox/.App
