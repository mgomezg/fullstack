# Test Fullstack Tech-K

## Instrucciones de instalación
Para la instalación del proyecto seguir los siguientes pasos:

* 1.- git clone https://github.com/dfloresc/fullstack-challenge
* 2.- cd /fullstack-challenge/techk/front
* 3.- npm install
* 4.- docker-compose up

Con esto el proyecto debería ejecutar correctamente.

### PyTest

Para ejecutar las pruebas unitarias se utiliza el siguiente comando "py.test" en la carpeta raíz del proyecto. Dichas pruebas se encuentran en los archivos "techk/apps/base/tests/TestUrls.py" y "techk/apps/scraper/tests/TestUrls.py".

## Notas con relación al proyecto

* Es posible que la base de datos SQLite se bloquee o se vuelva muy lenta por el flujo concurrente de información, esto puede depender de la velocidad de la maquina, el motor de base de datos (SQLite en este caso), como también de la velocidad de conexión a internet (se van acumulado los hilos de ejecución debido a la lentitud del mismo).

* Para realizar las pruebas se recomienda levantar el proyecto en un servidor (AWS, Azure, GCP), de todas formas el bloqueo de la base de datos puede pasar igual. Dejo la dirección de mi servidor de GCP para realizar pruebas si se estima conveniente (avisarme si no funciona, para reiniciar el servidor):
  * React: http://35.239.88.175:3000/
  * Django: http://35.239.88.175:8000/

### Experimental

Existe un parámetro que puede ayudar a que el Scraper termine más rápido, ***pero se aumenta la inestabilidad y las posibilidades de que la base de datos se bloquee***, se recomienda probar con máquinas más rápidas o servidores.

- El parámetro se encuentra en el archivo "techk/apps/scraper/views.py", linea 11. Aumentando el numero de "workers" o "processes", se aumenta la rapidez de recolección de información del Scrapper gracias al aumento de procesos que puede realizar el sistema "a la vez".
- Probando en una instancia de GCP, con base de datos SQLite, se obtuvieron resultados aproximados de:

|Workers  |Registros por segundo (Book + Log)  |Estabilidad
|--|--|--
| 2 | 12 | Normal (sufre pocos bloqueos)
| 4 | 16 | inestable
| 8 | 32 | Muy inestable
| 16 | 125 en promedio| La base de datos explota al ingresar 500 registros aprox. en 4 segundos

Cabe destacar que estos resultados pueden variar según las características de cada maquina (por ejemplo, con mi computadora e internet, con 2 workers registra aproximadamente 4/s)
