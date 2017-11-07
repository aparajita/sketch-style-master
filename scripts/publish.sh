#!/bin/sh

npm version "$1" && git push --follow-tags origin master
