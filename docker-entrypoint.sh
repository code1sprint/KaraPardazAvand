#!/bin/sh
set -e

# Named volumes are often created as root:root and overlay the image's
# chown'd uploads dir. Fix ownership before dropping to the app user.
mkdir -p /app/public/uploads
chown -R karapardaz:karapardaz /app/public/uploads

exec su-exec karapardaz "$@"
