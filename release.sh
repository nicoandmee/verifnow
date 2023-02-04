#!/usr/bin/env bash

release() {
    pnpm run lint
    pnpm run build
    pnpm run docs
    hub add .
    hub commit -m 'release'
    hub push
    npm version patch
    npm publish
}


release
