build:
	electron-packager . "Raccoon" --platform=darwin --arch=x64 --version=0.35.2 --out=builds
	zip -r Raccoon-darwin.zip builds/Raccoon-darwin-x64
	rm -rf builds

