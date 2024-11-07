# pull official base image
FROM python:3.9-slim-buster

WORKDIR /usr/src

# set working directory
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
    && apt-get clean \
    && apt install -y git \
    && apt install -y procps \
    && apt install sqlite3 -y libsqlite3-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .

# エントリーポイントスクリプトの権限を設定
COPY entrypoint.sh /usr/src/
RUN chmod 755 /usr/src/entrypoint.sh \
    && sed -i -e 's/\r$//' /usr/src/entrypoint.sh

# エントリーポイントを設定（シェル形式に変更）
ENTRYPOINT ["sh", "/usr/src/entrypoint.sh"]