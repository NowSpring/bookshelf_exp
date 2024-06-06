#!/bin/sh

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser --noinput --username=admin --email=admin@email.com

python manage.py runserver 0.0.0.0:8000

# Start the application (modify this line according to your application start command)
exec "$@"
