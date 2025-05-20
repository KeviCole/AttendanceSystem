#!/bin/bash
# Example ID (can modify later)
EXAMPLE_ID="AB12345"

# Create nested directories for an example ID
mkdir -p /home/students

# Create directory structure for each ID letter
ID_PATH="/home/students"
for ((i=0; i<${#EXAMPLE_ID}; i++)); do
    char="${EXAMPLE_ID:$i:1}"
    ID_PATH="$ID_PATH/$char"
    mkdir -p "$ID_PATH"

    # Create the three files at each directory
    touch "$ID_PATH/data.txt" "$ID_PATH/student.txt" "$ID_PATH/timestamp.txt"
done

# Permissions setup
# Create groups
groupadd students_group
groupadd professors_group
groupadd attendance_group

# Create a system user to own files (could also be system)
useradd -m -G students_group,professors_group,attendance_group sysadmin

# Set permissions
chown -R sysadmin:students_group /home/students
chown -R sysadmin:attendance_group /home/data
chown -R sysadmin:professors_group /home/info

chmod -R 750 /home/students  # Students can read, professors/admins can read/write
chmod -R 770 /home/data /home/info

# Finish
echo "Initialization complete."
