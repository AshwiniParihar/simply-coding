#!/bin/bash

# This script deletes all delete markers in a specified S3 bucket and prefix.
# To run this script, use the command:
# ./scripts/clear_delete_markers.sh

# Define the bucket name and prefix
bucket_name="sc-course-materials"
prefix="v2/"

# Ensure jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit
fi

# List and delete all delete markers under the specified prefix
aws s3api list-object-versions --bucket "$bucket_name" --prefix "$prefix" --query 'DeleteMarkers[?IsLatest==`true`]' | \
jq -r '.[] | .Key + " " + .VersionId' | \
while read key version; do
  echo "Deleting delete marker for $key (version: $version)"
  aws s3api delete-object --bucket "$bucket_name" --key "$key" --version-id "$version"
done