<!-- CLONAR REPOSITORIO -->

git clone https://github.com/Eliezer556/Sistema_Productos.git
cd Sistema_Productos-main

<!-- CONFIGURAR ENTORNO VIRTUAL -->

python -m venv venv

venv\Scripts\activate

<!-- INSTALAR DEPENDENCIAS -->

pip install -r requirements.txt

<!-- EN EL MYSQL CLIENT CREAR BASE DE DATOS -->

CREATE DATABASE Sistema_Productos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

<!-- CONFIGURAR VARIABLES DEL ENTORNO VIRTUAL ENTORNO VIRTUAL -->

cp .env.example .env

<!-- Editar el archivo .env con tus credenciales: -->

VARIABLES DE ENTORNO EN EL ARCHIVO .env.example

<!-- APLICAR MIGRACIONES -->

python manage.py migrate

<!-- CREAR SUPERUSER -->

python manage.py createsuperuser

<!-- EJECUTAR EL SERVIDOR -->

python manage.py runserver