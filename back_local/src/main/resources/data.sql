INSERT INTO tipo_empleo (nombre)
SELECT 'Jornada completa' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Jornada completa');

INSERT INTO tipo_empleo (nombre)
SELECT 'Jornada Parcial' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Jornada Parcial');

INSERT INTO tipo_empleo (nombre)
SELECT 'Por cuenta propia' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Por cuenta propia');

INSERT INTO tipo_empleo (nombre)
SELECT 'Autonomo' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Autonomo');

INSERT INTO tipo_empleo (nombre)
SELECT 'Contrato por servicio' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Contrato por servicio');

INSERT INTO tipo_empleo (nombre)
SELECT 'Practicas' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Practicas');

INSERT INTO tipo_empleo (nombre)
SELECT 'Practicas laborales' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Practicas laborales');

INSERT INTO tipo_empleo (nombre)
SELECT 'Trabajo de temporada' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_empleo WHERE nombre = 'Trabajo de temporada');

INSERT INTO tipo_ubicacion (nombre)
SELECT 'Presencial' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_ubicacion WHERE nombre = 'Presencial');

INSERT INTO tipo_ubicacion (nombre)
SELECT 'Híbrido' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_ubicacion WHERE nombre = 'Híbrido');

INSERT INTO tipo_ubicacion (nombre)
SELECT 'Remoto' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_ubicacion WHERE nombre = 'Remoto');

INSERT INTO tipo_educacion (nombre)
SELECT 'Formacion Académica' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_educacion WHERE nombre = 'Formacion Académica');

INSERT INTO tipo_educacion (nombre)
SELECT 'Cursos y Certificaciones' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_educacion WHERE nombre = 'Cursos y Certificaciones');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Backend' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Backend');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Frontend' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Frontend');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Frameworks y Librerías' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Frameworks y Librerías');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Bases de Datos' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Bases de Datos');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Herramientas' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Herramientas');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Metodologías' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Metodologías');

INSERT INTO tipo_habilidad (nombre)
SELECT 'Idiomas' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tipo_habilidad WHERE nombre = 'Idiomas');
