#!/usr/bin/env bash

echo Ensure ssh-agent is started and key is added
eval `ssh-agent`
ssh-add

echo Deploying to STAGING
pm2 deploy ecosystem.json production --force
