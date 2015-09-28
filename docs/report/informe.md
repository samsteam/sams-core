# SAMS - Some Awesome Memory Scheduler

# Integrantes
* Natalia Aparicio
* Ignacio Babbini
* Bruno Cascio
* Cirano Eusebi
* Cristian Sottile

# Objetivo
El objetivo del proyecto es el desarrollo de un software que simule los diferentes algoritmos mediante los cuales el sistema operativo gestiona la memoria en las computadoras.

# Motivación
Una de las unidades temáticas de la cursada de la materia Introducción a los Sistemas Operativos es **la memoria y su administración por parte del sistema operativo**. Existen diferentes algoritmos mediante los cuales este último lleva a cabo dicha tarea.

En la parte práctica de la unidad se diagrama la atención a las solicitudes de carga y descarga de datos por parte de los procesos. Los ejercicios consisten en indicar, para cada instante de memoria, los datos presentes en ella, emulando así el comportamiento que ofrecería el algoritmo real.

Durante este modelo de resolución nos encontramos con dos circunstancias mejorables: 

##### La realización del diagrama
Como para cada instante de memoria se deben escribir todos los datos, el proceso se vuelve tedioso y repetitivo, e invita al estudiante a perder el foco atendiendo cuestiones ajenas a la forma concreta en que el algoritmo gestiona la memoria, que es la clave de la resolución de los ejercicios.

##### La resolución de dudas
En algunas ocasiones, la situación escapa del flujo ideal, y la respuesta que ofrecería el algoritmo no resulta obvia.

Nos pareció que sería útil para los alumnos poseer una herramienta que agilice esas dos actividades, permitiendo al usuario ingresar los datos del ejercicio, y proveyendo:

* La resolución automática, como lo harían los diferentes algoritmos. Esto permitiría solventar dudas de forma sencilla.
* Un esqueleto de diagrama para que complete el usuario, resolviendo de forma manual el ejercicio, y pudiéndo compararlo luego de forma automática con la resolución generada por la herramienta. Esto permitiría, además de la verificación de la correctitud de los ejercicios, que el proceso de resolución se centre en la esencia del mismo, *cómo el algoritmo resuelve las solicitudes*, gracias a la eliminación de la parte repetitiva y sin importancia.

# Tecnología
La aplicación se desarrolló como un servicio web, para lo cual se utilizaron mayormente herramientas y frameworks basados en Javascript:

* Node Package Manager para el manejo de paquetes y dependencias.
* Cocktail para la implementación del diseño orientado a objetos generado para la resolución de los algoritmos.
* GruntJS para la optimización de las tareas de desarrollo y respuesta de la aplicación.
* Mocha para generar un conjunto de tests de unidad.
* AngularJS para el front-end.
* Bootstrap como framework CSS.
* Node-Webkit para la exportación a aplicación de escritorio.

# Prototipo generado
![](./images/home.png)
![](./images/requirements_1.png)
![](./images/requirements_2.png)
![](./images/requirements_3.png)
![](./images/policies.png)
![](./images/resolution.png)

# Conclusiones

# Trabajo futuro
Se consideraron algunas ideas para la extensión futura del software, tanto para incrementar sus capacidades como para mejorar la experiencia de usuario:
Durante el desarrollo del proyecto surgieron algunas ideas que, si bien no estuvieron pevistas desde un primer momento, resultan deseables de adherir a la aplicación, 

* Desarrollar diferentes modalidades para el modo interactivo de la aplicación, como agregar temporizadores y/o diferentes dificultades.
* Realizar una corrección de errores más descriptiva.
* Proveer una explicación instante a instante del porqué de las desiciones del manejador de memoria en el modo pasivo.
* Agregar más combinaciones de politicas y algoritmos.