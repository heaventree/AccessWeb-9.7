#!/bin/bash

# AccessWeb WCAG Checker WordPress Plugin Build Script
# This script packages the plugin for distribution

set -e

echo "Building AccessWeb WCAG Checker WordPress Plugin..."

PLUGIN_DIR="accessweb-wcag-checker"
BUILD_DIR="build"
ZIP_NAME="accessweb-wcag-checker.zip"

# Clean previous builds
rm -rf $BUILD_DIR
rm -f $ZIP_NAME

# Create build directory
mkdir -p $BUILD_DIR

# Copy plugin files
echo "Copying plugin files..."
cp -r $PLUGIN_DIR $BUILD_DIR/

# Remove development files
echo "Cleaning development files..."
cd $BUILD_DIR/$PLUGIN_DIR
rm -f .DS_Store
rm -f *.log
rm -rf node_modules
rm -rf .git
find . -name "*.tmp" -delete
find . -name "*.bak" -delete

# Create zip package
echo "Creating ZIP package..."
cd ..
zip -r ../$ZIP_NAME $PLUGIN_DIR

cd ..
echo "Build complete: $ZIP_NAME"
echo "Plugin ready for WordPress installation"

# Display package info
echo ""
echo "Package Information:"
echo "==================="
echo "Plugin Name: AccessWeb WCAG Checker"
echo "Version: 1.0.0"
echo "Package: $ZIP_NAME"
echo "Size: $(du -h $ZIP_NAME | cut -f1)"

echo ""
echo "Installation Instructions:"
echo "========================="
echo "1. Upload $ZIP_NAME to WordPress admin"
echo "2. Go to Plugins > Add New > Upload Plugin"
echo "3. Choose $ZIP_NAME and install"
echo "4. Activate the plugin"
echo "5. Configure API settings in WCAG Checker > Settings"