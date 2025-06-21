# Variables específicas para tu proyecto
VENV = venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
DJANGO_MANAGE = $(PYTHON) manage.py

# Comando principal (instalación completa)
setup: venv install migrate

# Crear entorno virtual
venv:
	python3 -m venv $(VENV)
	@echo "\n✅ Entorno virtual creado en ./$(VENV)\n"

# Instalar dependencias
install:
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo "\n✅ Dependencias instaladas\n"

# Aplicar migraciones
migrate:
	$(DJANGO_MANAGE) migrate
	@echo "\n✅ Base de datos migrada\n"

# Iniciar servidor
run:
	$(DJANGO_MANAGE) runserver

# Comando adicional: Crear superusuario
superuser:
	$(DJANGO_MANAGE) createsuperuser

# Limpieza
clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	rm -rf .mypy_cache .pytest_cache
	@echo "\n🧹 Archivos temporales eliminados\n"