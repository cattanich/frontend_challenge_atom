# Frontend Challenge Atom

## Documentación

### Decisiones de diseño
- Se optó por una arquitectura modular y componentes standalone para facilitar la escalabilidad y mantenimiento.
- Se utilizó Bootstrap con el tema Flatly de Bootswatch para el diseño responsive y accesible, evitando Angular Material por preferencias del usuario.
- El manejo del estado y la comunicación con el backend se realiza mediante servicios Angular que consumen una API REST.
- Se implementó enrutamiento con lazy loading y guards para proteger las rutas que requieren autenticación.
- El almacenamiento local usa `localStorage` para guardar el `userId` y `userEmail` del usuario autenticado.

### Tecnologías utilizadas
- Angular 17
- Bootstrap 5 con tema Flatly (Bootswatch)
- Firebase Firestore para backend y almacenamiento de datos
- Express para API REST
- RxJS para manejo de observables y asincronía

### Comentarios relevantes
- Se decidió eliminar Angular Material para usar Bootstrap por preferencia del usuario.
- Se implementó un diálogo de confirmación para creación de usuario usando `window.confirm` en lugar de componentes de Angular Material.
- Se manejan correctamente los estados de las tareas con checkboxes y opciones para editar y eliminar.
- Se aplicaron buenas prácticas de Angular como uso de observables, async pipes, trackBy en ngFor, y validaciones en formularios.

### Problemas encontrados
- Inicialmente hubo problemas con la conversión de fechas de Firestore, que se resolvieron con mapeo adecuado en el servicio.
- Se presentaron errores de CORS que se solucionaron configurando correctamente el backend.
- Hubo confusión en el manejo del `userId` y `userEmail` para filtrar tareas, que se corrigió asegurando que el `userId` sea el identificador único del usuario y se use para filtrar las tareas.
- Se eliminaron dependencias y referencias a Angular Material para evitar errores y se migró a Bootstrap con tema Flatly.

---

La aplicación está lista para ser ejecutada y probada con:

```
cd frontend_challenge_atom && npm start
```

Luego acceder en `http://localhost:4200`.
