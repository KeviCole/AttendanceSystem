## 📘 README

### RFID System Docker Image 


* `find_student.sh`: The main script for locating student directories.
* `init.sh`: Presumably sets up the directory structure or initializes data.
* `Dockerfile`: Used to containerize the environment for testing or deployment.

---

#### `Dockerfile`

The Dockerfile is used to build a containerized environment for testing and running the script. It provides a minimal Linux environment with Bash installed and ensures all files are available within the container.

**Sample Dockerfile Contents**:

```Dockerfile
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y bash && \
    mkdir -p /home/students

COPY init.sh /init.sh
COPY find_student.sh /find_student.sh

RUN chmod +x /init.sh /find_student.sh

CMD ["/bin/bash"]
```

**Build and Run**:

```bash
docker build -t attendance .
docker run --rm -it attendance
```

This allows isolated execution and testing without affecting the host system.

---

### Files

#### `find_student.sh`

A shell script that:

* Validates a 7-character student ID (e.g., AB12345).
* Validates a 10-character password.
* Traverses a nested directory structure under `/home/students`, where each character of the ID corresponds to a subdirectory level.
* If the full path exists, it logs the current UNIX timestamp into a `timestamp.txt` file in the student's directory.

**Usage**:

```bash
./find_student.sh ID PASSWORD
```

**Example**:

```bash
./find_student.sh AB12345 1234567890
```

**Output**:

```
Student ID located: /home/students/A/B/1/2/3/4/5
Timestamp updated.
```

---

#### `init.sh`

This script (contents not shown here) likely initializes the student directory structure under `/home/students`. This setup is required for `find_student.sh` to function correctly.

Ensure it is run before using the main script.

```bash
chmod +x init.sh
./init.sh
```

---

#### `Dockerfile`

The Dockerfile likely creates a controlled Linux environment with required tools to run `find_student.sh`. A typical usage pattern might look like:

```bash
docker build -t student-finder .
docker run --rm -it student-finder
```

---

###  Directory Structure

The expected directory format is:

```
/home/students/A/B/1/2/3/4/5/
```

Where `AB12345` is a sample student ID, each character is a nested directory level.

---

### Prerequisites

* Bash-compatible shell
* Root or sufficient permissions to write to `/home/students`
* Docker (optional, for containerized execution)

