# #!/bin/bash
# set -x

# # Define the path to your local-main-content.json file
# local_file="./lessons/html/lesson-1-intro/local-main-content.json"
# # Define the path to the output main-content.json file
# output_file="./lessons/html/lesson-1-intro/main-content.json"

# # Define your AWS base URL
# aws_base_url="https://sc-course-materials.s3.us-west-2.amazonaws.com/v2"

# # Copy the local JSON to create a new file
# cp "$local_file" "$output_file"

# # Replace relative paths in the JSON with full AWS paths
# sed -i "" "s|\"/assets|\"$aws_base_url/assets|g" "$output_file"
# sed -i "" "s|\"/lessons|\"$aws_base_url/lessons|g" "$output_file"
