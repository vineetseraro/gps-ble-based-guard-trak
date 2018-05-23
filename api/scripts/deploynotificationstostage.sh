#!/bin/bash
declare -a arr=("appsetting" "emails" "issue" "notifications" "order" "shipment" "things" "crons")
for file in "${arr[@]}" ; do 
gnome-terminal -x bash -c "export AWS_CLIENT_TIMEOUT=3600000; cd '../config/packaging/$file';echo $file; sls deploy --alias $1; bash"; done

