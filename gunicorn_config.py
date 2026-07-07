# gunicorn_config.py
import multiprocessing

# The socket to bind.
bind = "0.0.0.0:8080"

# The number of worker processes for handling requests.
workers = 4

# Log level
loglevel = 'info'

# Where to log to
accesslog = '-'  # '-' means log to stdout
errorlog = '-'  # '-' means log to stderr