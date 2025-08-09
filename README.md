estructura del backend


backend/
├── apps/                    # Carpeta contenedora de todas las apps
│   ├── __init__.py
│   ├── authentication/      # Rename 'users' y ampliar funcionalidad
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── services.py
│   │   └── tests/
│   ├── clients/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── services.py      # Lógica de negocio
│   │   ├── validators.py    # Validaciones personalizadas
│   │   └── tests/
│   ├── messaging/           # Rename 'apiWhatsapp' 
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── whatsapp.py
│   │   │   └── telegram.py  # Para futura expansión
│   │   ├── providers/       # Diferentes proveedores de messaging
│   │   └── tests/
│   ├── core/                # Funcionalidades compartidas
│   │   ├── models.py        # Modelos base abstractos
│   │   ├── exceptions.py    # Excepciones personalizadas
│   │   ├── permissions.py   # Permisos reutilizables
│   │   ├── pagination.py    # Paginación personalizada
│   │   ├── utils.py         # Utilidades generales
│   │   └── validators.py    # Validadores comunes
│   └── documents/           # Rename 'docs'
├── config/                  # Archivos de configuración
├── requirements/            # Dependencias por ambiente
│   ├── base.txt
│   ├── development.txt
│   ├── production.txt
└── scripts/                 # Scripts de utilidades