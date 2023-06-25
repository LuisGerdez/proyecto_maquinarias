FROM python:3.8.3-alpine3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add --no-cache mariadb-dev \
    && pip install --upgrade pip

COPY ./requirements.txt ./

RUN pip install -r requirements.txt

COPY ./ ./

#RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 8099

CMD python manage.py collectstatic --settings=project.settings.production --no-input \
    && python manage.py migrate --settings=project.settings.production \
    && gunicorn --env DJANGO_SETTINGS_MODULE=project.settings.production --bind 0.0.0.0:8000 project.wsgi:application