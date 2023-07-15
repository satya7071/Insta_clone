# build_files.sh

apt-get install -y default-libmysqlclient-dev
pip install -r requirements.txt
python3.9 manage.py collectstatic