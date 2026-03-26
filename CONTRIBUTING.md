# 🤝 Guía de Contribución

Gracias por tu interés en contribuir a este proyecto 🚀

---

## 📌 Flujo de trabajo

1. Hacer un fork del repositorio (si aplica)
2. Crear una rama desde `develop`:

```bash
git checkout develop
git checkout -b feature/nombre-funcionalidad
```

3. Realizar cambios
4. Hacer commits siguiendo la convención
5. Subir la rama:

```bash
git push origin feature/nombre-funcionalidad
```

6. Crear un Pull Request hacia `develop`

---

## 🌿 Convención de ramas

* `feature/*` → nuevas funcionalidades
* `bugfix/*` → corrección de errores

Ejemplos:

```
feature/seguimiento-envios
bugfix/error-login
```

---

## ✍️ Convención de commits

Formato obligatorio:

```
tipo: descripción
```

Tipos permitidos:

* `feat`
* `fix`
* `docs`
* `style`
* `refactor`
* `test`

Ejemplos:

```
feat: agrega busqueda de envio
fix: corrige cambio de estado de envio
```

---

## 📏 Buenas prácticas

* Un commit por cambio lógico
* Mensajes claros y descriptivos
* No usar mensajes genéricos como:

```
cambios varios
arreglos
```

---

## 🔍 Pull Requests

Antes de enviar un PR:

* Verificar que el código funcione
* Asegurarse de que no rompe otras funcionalidades
* Agregar descripción clara del cambio

---

## ✅ Revisión

Los PRs serán revisados antes de ser integrados a `develop`.

---

¡Gracias por contribuir! 🎉
