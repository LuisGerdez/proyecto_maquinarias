#!/bin/sh

echo 'Running collecstatic...'
python manage.py collectstatic --settings=project.settings.production --no-input

echo 'Applying migrations...'
# python manage.py wait_for_db --settings=project.settings.production
python manage.py migrate --settings=project.settings.production

echo 'Running server...'
#gunicorn --env DJANGO_SETTINGS_MODULE=project.settings.production project.wsgi:application --bind 0.0.0.0:$PORT
gunicorn --env DJANGO_SETTINGS_MODULE=project.settings.production project.wsgi:application --bind 0.0.0.0:$PORT