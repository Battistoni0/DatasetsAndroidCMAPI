#Integrantes

**Profesor:** 
 - Sebastián Salazar Molina .
   
**Integrantes:** 
 - Héctor Arturo Araya Pérez
 - Carlos Araya
 - Ian Battistoni

# Integración con la API en NestJS

El backend de la aplicación está desarrollado en NestJS, proporcionando varios endpoints para manejar las solicitudes y operaciones de la aplicación:

## Subida de Archivos (POST /upload)

- Este endpoint permite subir imágenes. Utiliza `diskStorage` de multer para almacenar las imágenes en el servidor.
- Las imágenes se guardan en el dataset y subfolder especificado, y se almacena la descripción proporcionada.

## Obtener Folders (GET /folders)

- Este endpoint devuelve la lista de datasets disponibles.

## Obtener Subfolders (POST /subfolders)

- Este endpoint devuelve los subfolders de un dataset específico.

## Obtener Imágenes (POST /images)

- Este endpoint devuelve las imágenes de un subfolder específico.

## Obtener Readme (POST /readme)

- Este endpoint devuelve el archivo readme de un dataset, proporcionando información adicional sobre el dataset.

## Descargar Dataset (POST /download)

- Este endpoint comprime un dataset en un archivo ZIP y lo envía como un archivo descargable.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
