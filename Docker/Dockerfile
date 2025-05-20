FROM ubuntu:22.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    bash \
    python3 \
    python3-pip \
    sudo \
    && apt-get clean

# Create needed directories
RUN mkdir -p /home/students /home/info /home/data \
    && touch /home/README.md

# Copy scripts into container
COPY init.sh /home/init.sh
COPY find_student.sh /home/find_student.sh

# Make scripts executable
RUN chmod +x /home/init.sh /home/find_student.sh

# Set working directory
WORKDIR /home

# Important: Delay init.sh to **runtime**, NOT during build
# Otherwise the init script will fail if environment isn't ready
# Instead of running during build, we will run when container starts
ENTRYPOINT ["/bin/bash", "-c", "/home/init.sh && exec /bin/bash"]
