// Catálogo de métricas ESG Luteach
// value/unit/live/format/trend: campos ilustrativos para demo en vivo. Sustituir con datos reales.
const ESG_METRICS = [
  {
    "id": "S-00", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Estudiantes totales registrados",
    "definition": "<p>Número acumulado de estudiantes que han sido inscritos en la plataforma Luteach desde el inicio del contrato, sin importar si están activos en el período actual. A diferencia de los beneficiarios activos (S-01), este indicador refleja el alcance histórico total del programa.</p><div class='def-block formula'><strong>¿Quién se cuenta?</strong> Todo estudiante que completó el proceso de inscripción y tiene al menos una sesión registrada en cualquier momento desde el inicio del programa, incluyendo quienes pausaron o finalizaron su participación.</div><div class='def-block why'><strong>¿Por qué importa?</strong> El total registrado revela el alcance acumulado: cuántas personas han sido beneficiadas en toda la vida del contrato. Combinado con S-01 (activos en los últimos 3 meses), permite calcular la tasa de continuidad del programa y detectar si hay estudiantes que no mantuvieron el uso del servicio.</div>",
    "stakeholder": "Todos", "ods": [4,10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Registro de estudiantes'", "frequency": "Mensual",
    "value": 52, "unit": "estudiantes", "live": false, "format": "int",
    "trendLabel": "+4", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-01", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Beneficiarios activos totales",
    "definition": "<p>Número de estudiantes que han completado al menos una sesión de tutoría en los últimos 3 meses. Es el indicador de alcance operativo más relevante: refleja quiénes están usando el servicio de forma activa en la actualidad.</p><div class='def-block formula'><strong>¿Quién se cuenta?</strong> Un estudiante se considera 'activo' si tiene al menos una sesión completada o confirmada en los últimos 90 días. Estudiantes con contrato vigente pero sin sesiones recientes no se incluyen en este indicador.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Es la base de todos los KPIs cruzados: costo por beneficiario, CO₂e por estudiante, horas por estudiante. Un crecimiento sostenido indica que el programa está escalando con impacto real, mientras que una caída respecto al total registrado (S-00) señala oportunidades de reengagement.</div>",
    "stakeholder": "Todos", "ods": [4,10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Estudiantes activos'", "frequency": "Trimestral",
    "value": 40, "unit": "estudiantes", "live": true, "format": "int",
    "trendLabel": "+8%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-02", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Beneficiarios por segmento",
    "definition": "<p>Clasifica a todos los beneficiarios en tres grupos según su relación con la empresa cliente y la fuente de financiamiento:</p><p><strong>1. Hijos de colaboradores:</strong> el empleador financia la tutoría como beneficio laboral para su fuerza de trabajo.<br><strong>2. Becarios:</strong> estudiantes con beca parcial o total, generalmente de zonas con menor acceso a educación de calidad.<br><strong>3. Comunidad externa:</strong> acceso abierto o a través de alianzas con ONGs, fundaciones o municipios.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Este desglose permite a la empresa reportar qué porción de su inversión social impacta directamente a sus propios colaboradores vs. a la comunidad más amplia, un dato clave para diferenciar el beneficio laboral (RRHH) de la responsabilidad social corporativa (RSC).</div>",
    "stakeholder": "Por segmento", "ods": [10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo de segmentación de programa", "frequency": "Mensual",
    "value": 3, "unit": "segmentos", "live": false, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-03", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Horas de tutoría contratadas",
    "definition": "<p>Total de horas de tutoría adquiridas por la empresa cliente según el contrato vigente con Luteach, independientemente de si ya fueron utilizadas.</p><div class='def-block formula'><strong>¿Cómo se mide?</strong> Se extrae del módulo de compra de horas al momento de firmar o renovar el contrato. Incluye todos los paquetes activos del período.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Define el techo máximo de impacto posible. Es el denominador del indicador de utilización (S-05): si se contrataron 520 horas y solo se usaron 260, hay una oportunidad de duplicar el impacto sin costo adicional. Un porcentaje bajo de uso puede indicar barreras de comunicación interna o diseño del programa.</div>",
    "stakeholder": "Empresa cliente", "ods": [], "gri": ["203-1"], "alignment": "Adaptado", "lbg": "Input",
    "source": "Módulo 'Compra de horas'", "frequency": "Por contrato",
    "value": 520, "unit": "horas", "live": false, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-04", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Horas de tutoría utilizadas",
    "definition": "<p>Horas de tutoría efectivamente entregadas: sesiones completadas y confirmadas por ambas partes (estudiante y Luteacher). No incluye sesiones canceladas o ausencias sin sustitución.</p><div class='def-block formula'><strong>Fórmula:</strong> Σ (duración en horas de cada sesión con estado 'Completada' en el período).</div><div class='def-block why'><strong>¿Por qué importa?</strong> Es el indicador más directo de entrega real del servicio. Cada hora utilizada representa una hora de aprendizaje ocurrida. La brecha entre horas contratadas (S-03) y utilizadas (S-04) es la principal oportunidad de mejora de impacto sin costo adicional para la empresa cliente.</div>",
    "stakeholder": "Todos", "ods": [], "gri": ["203-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Utilización de horas'", "frequency": "Mensual",
    "value": 260, "unit": "horas", "live": true, "format": "int",
    "trendLabel": "+5%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-05", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Tasa de utilización de horas",
    "definition": "<p>Porcentaje del paquete de horas contratado que está siendo efectivamente aprovechado por las familias.</p><div class='def-block formula'><strong>Fórmula:</strong> (Horas utilizadas S-04 ÷ Horas contratadas S-03) × 100</div><p>Un 100% significa que el programa está siendo usado a plena capacidad. Una tasa baja puede indicar barreras de acceso, falta de comunicación interna en la empresa cliente, o desajuste entre la oferta y la disponibilidad de las familias.</p><div class='def-block goal'><strong>Referencia:</strong> Se recomienda mantener una tasa superior al 80% para maximizar el retorno de la inversión. Por debajo del 60% se activa una alerta de 'programa subutilizado'.</div>",
    "stakeholder": "Empresa cliente", "ods": [], "gri": ["203-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Calculado: S-04 / S-03", "frequency": "Mensual",
    "value": 50, "unit": "%", "live": true, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-06", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Sesiones / clases dictadas",
    "definition": "<p>Número total de clases completadas en el período, ya sean individuales o grupales. Cada sesión se cuenta cuando comenzó y finalizó según lo programado y ambas partes la confirman en la plataforma.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Es el Output operativo más directo. Junto con las horas utilizadas (S-04) permite calcular la duración promedio por sesión, lo que ayuda a identificar si las clases son demasiado cortas (impacto reducido) o demasiado largas (fatiga del estudiante). Una sesión típica de Luteach dura entre 1 y 1.5 horas.</div>",
    "stakeholder": "Todos", "ods": [4], "gri": ["404-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Sesiones'", "frequency": "Mensual",
    "value": 260, "unit": "sesiones", "live": true, "format": "int",
    "trendLabel": "+12%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-07", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "Distribución geográfica de beneficiarios",
    "definition": "<p>Número de regiones, ciudades o zonas geográficas distintas donde existe al menos un estudiante activo en el programa durante el período. Una región se activa cuando tiene su primer beneficiario inscrito con sesión completada.</p><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> El estándar GRI 413-1 exige reportar la cobertura geográfica de las iniciativas de comunidad local. Un mayor número de regiones demuestra que el impacto no está concentrado en una sola ciudad o grupo corporativo, y que Luteach llega a territorios con menor acceso histórico a educación de calidad.</div>",
    "stakeholder": "Comunidad", "ods": [10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Mapa de impacto'", "frequency": "Trimestral",
    "value": 5, "unit": "regiones", "live": false, "format": "int",
    "trendLabel": "+1", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-08", "pillar": "social", "category": "Alcance y cobertura",
    "metric": "% cobertura sobre población objetivo",
    "definition": "<p>Mide qué proporción de la población potencialmente beneficiaria (hijos de colaboradores en edad escolar + becarios elegibles registrados por RRHH) está efectivamente activa en el programa.</p><div class='def-block formula'><strong>Fórmula:</strong> (Beneficiarios activos inscritos ÷ Total de personas elegibles reportadas por RRHH del cliente) × 100</div><p>Un 67% significa que 1 de cada 3 personas que podrían beneficiarse aún no accede al programa.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Incrementar esta cobertura es la principal palanca de impacto social sin aumentar el costo del contrato. La brecha restante suele deberse a: desconocimiento del programa, barreras tecnológicas o incompatibilidad de horarios.</div>",
    "stakeholder": "Colaboradores / Becarios", "ods": [10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Cruce con RRHH del cliente", "frequency": "Anual",
    "value": 67, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+3%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-09", "pillar": "social", "category": "Resultados académicos",
    "metric": "% estudiantes con mejora de notas",
    "definition": "<p>Porcentaje de estudiantes cuyo promedio de calificaciones aumentó respecto al punto de partida registrado al inicio del programa. La plataforma Luteach permite a cada estudiante ingresar sus notas antes de comenzar las clases de un curso, y registrar sus calificaciones más recientes después de completar ciclos de tutoría. El sistema calcula automáticamente la progresión.</p><div class='def-block formula'><strong>¿Cómo funciona?</strong> Al inscribirse en un curso, el estudiante ingresa su nota actual (línea base). Al finalizar un ciclo de sesiones, registra su nueva calificación. La plataforma genera una vista de progresión y compara el promedio antes y después por materia. Se considera 'mejora' cualquier incremento positivo en la calificación reportada.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Es el Outcome académico más importante para justificar la inversión ante la empresa cliente. Al basarse en datos que el propio estudiante ingresa a la plataforma, la medición es continua y no depende de encuestas periódicas. Pasar del 73% al 80% significa que 7 estudiantes adicionales de cada 100 mejoran sus notas gracias al programa.</div><div class='def-block goal'><strong>Referencia:</strong> Programas de tutoría con impacto reconocido internacionalmente suelen reportar tasas del 65% a 85%. El 73% actual es un resultado sólido y mejorable con mayor frecuencia de registro.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["404-2"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Módulo 'Progreso académico'", "frequency": "Bimestral",
    "value": 73, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+6%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-11", "pillar": "social", "category": "Resultados académicos",
    "metric": "Progreso promedio por curso (delta de nota)",
    "definition": "<p>Calcula la diferencia promedio entre la calificación al inicio del programa (línea base) y la calificación más reciente, promediada para todos los estudiantes y materias del período.</p><div class='def-block formula'><strong>Fórmula:</strong> Promedio de (nota_actual − nota_inicial) para todos los pares estudiante-materia del período.<br>Un valor de +1.4 pts (en escala sobre 20) significa que, en promedio, los estudiantes subieron 1.4 puntos en sus materias.</div><div class='def-block goal'><strong>Referencia:</strong> En sistemas de notas sobre 20 puntos, una mejora de 1 a 2 puntos se considera significativa. En sistemas sobre 10 puntos, 0.5 pts ya es relevante. Este indicador permite comparar la efectividad del programa por materia (¿en qué cursos mejoran más?).</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["404-2"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Módulo 'Progreso académico'", "frequency": "Bimestral",
    "value": 1.4, "unit": "pts", "live": false, "format": "dec1",
    "trendLabel": "+0.3", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-12", "pillar": "social", "category": "Resultados académicos",
    "metric": "Tasa de asistencia a sesiones",
    "definition": "<p>Porcentaje de sesiones programadas que el estudiante efectivamente asistió y completó.</p><div class='def-block formula'><strong>Fórmula:</strong> (Sesiones completadas ÷ Sesiones programadas en el período) × 100<br>Una tasa del 97% indica que prácticamente todas las clases agendadas se llevaron a cabo.</div><div class='def-block why'><strong>¿Por qué importa?</strong> La asistencia es el predictor más fuerte del impacto académico: los estudiantes con asistencia superior al 90% tienen 3× más probabilidad de mejorar sus notas. También refleja el compromiso real de las familias con el programa y permite detectar problemas de adaptación o satisfacción antes de que escalen.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["404-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Asistencia'", "frequency": "Mensual",
    "value": 97, "unit": "%", "live": true, "format": "dec1",
    "trendLabel": "+2%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-13", "pillar": "social", "category": "Resultados académicos",
    "metric": "Tasa de aprobación de cursos",
    "definition": "<p>Porcentaje de cursos en los que el estudiante obtuvo una calificación aprobatoria al finalizar el período de tutoría con Luteach. Se calcula sobre el total de cursos trabajados en el programa durante el bimestre.</p><div class='def-block formula'><strong>¿Cómo se mide?</strong> Se toma el número de cursos donde el estudiante registra una nota final aprobatoria (según la escala de su institución educativa) y se divide entre el total de cursos trabajados en el período. La plataforma cruza la calificación final reportada por el estudiante con el umbral de aprobación declarado al inicio.</div><div class='def-block why'><strong>¿Por qué importa?</strong> La mejora de notas (S-09) mide progresión; la aprobación de cursos mide resultados concretos. Un estudiante puede mejorar del 8 al 10 pero seguir reprobando. Este indicador captura si Luteach logra llevar al estudiante por encima del umbral de aprobación, que es el objetivo más inmediato y práctico para las familias. También permite detectar cursos con alta tasa de reprobación donde se puede reforzar el programa.</div><div class='def-block goal'><strong>Seguimiento recomendado:</strong> Monitorear la tasa por materia permite identificar áreas donde el programa tiene mayor impacto y dónde requiere ajustes pedagógicos. Una tasa general inferior al 70% activa revisión del plan de estudio.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["404-2"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Módulo 'Progreso académico'", "frequency": "Bimestral",
    "value": 81, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+4%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-14", "pillar": "social", "category": "Resultados académicos",
    "metric": "Reducción de tasa de deserción",
    "definition": "<p>Compara la tasa de abandono escolar de los beneficiarios de Luteach con la tasa promedio nacional o sectorial para el mismo grupo demográfico y nivel educativo. Mide tanto el abandono total del colegio como el abandono de materias específicas antes del examen final.</p><div class='def-block formula'><strong>Interpretación del valor:</strong> Una reducción del 23% significa que, comparado con jóvenes en contextos similares sin el programa, los estudiantes de Luteach tienen un 23% menos de probabilidad de abandonar sus estudios en el período. Casos de riesgo detectados: estudiantes que reprueban 2 o más cursos consecutivos, con asistencia inferior al 70% o que solicitan pausar el programa.</div><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> Este es el indicador de impacto (LBG Impact) de mayor alcance temporal: reducir la deserción escolar tiene efectos en empleabilidad, ingresos futuros y movilidad social durante décadas. La combinación de S-13 (aprobación de cursos) con S-14 permite identificar estudiantes en riesgo de deserción antes de que abandonen, activando intervención proactiva de los Luteachers.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Encuesta + benchmark externo", "frequency": "Anual",
    "value": 23, "unit": "% reducción", "live": false, "format": "int",
    "trendLabel": "mejora", "trendUp": false, "trendGood": true
  },
  {
    "id": "S-15", "pillar": "social", "category": "Resultados académicos",
    "metric": "Materias / cursos reforzados",
    "definition": "<p>Número de materias o áreas del conocimiento distintas que están siendo trabajadas activamente con al menos un estudiante durante el período: Matemática, Física, Química, Programación, Inglés, Historia, etc.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Permite a la empresa cliente evaluar si el programa cubre las necesidades académicas específicas de sus colaboradores-hijos. Una empresa tecnológica puede priorizar Matemática y Programación; un banco puede valorar más Finanzas e Inglés. Un mayor número de materias indica mayor versatilidad del equipo de Luteachers y mayor impacto potencial por estudiante.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": ["404-2"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Catálogo de cursos'", "frequency": "Mensual",
    "value": 6, "unit": "cursos", "live": true, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-16", "pillar": "social", "category": "Bienestar y satisfacción",
    "metric": "Satisfacción de padres/colaboradores",
    "definition": "<p>Puntuación promedio de satisfacción de los padres y/o colaboradores de la empresa cliente, medida mediante encuesta CSAT (Customer Satisfaction Score) al finalizar cada bimestre de programa. La escala es de 1 a 5.</p><p>La encuesta incluye preguntas sobre: calidad percibida del Luteacher, comunicación y transparencia de Luteach, mejoras observadas en el hijo/a, y facilidad de uso de la plataforma.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Los padres y colaboradores son el canal más importante de renovación y referencia del programa. Un colaborador satisfecho lo recomienda internamente, lo que reduce el costo de adquisición y aumenta la cobertura (S-08). Una puntuación por debajo de 3.5 activa un protocolo de mejora urgente.</div>",
    "stakeholder": "Colaboradores", "ods": [], "gri": ["401-2"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Módulo 'Encuestas'", "frequency": "Trimestral",
    "value": 4.3, "unit": "/ 5", "live": false, "format": "dec1",
    "trendLabel": "+0.2", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-17", "pillar": "social", "category": "Bienestar y satisfacción",
    "metric": "Satisfacción de estudiantes",
    "definition": "<p>Puntuación promedio de satisfacción del estudiante al finalizar cada ciclo de clases, en una escala de 1 a 5. La encuesta pregunta sobre: claridad de las explicaciones del Luteacher, si el ritmo de la clase se adaptó a sus necesidades, si se siente más seguro con la materia, y si recomendaría el programa a sus amigos.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Un estudiante satisfecho es un estudiante que no falta a sus clases y que aprovecha más el tiempo de tutoría. La satisfacción del estudiante está directamente correlacionada con la mejora de notas (S-09) y con la asistencia (S-12). Es también el principal indicador de la calidad pedagógica de los Luteachers.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": [], "alignment": "Sin estandar directo", "lbg": "Outcome",
    "source": "Módulo 'Encuestas'", "frequency": "Bimestral",
    "value": 4.2, "unit": "/ 5", "live": false, "format": "dec1",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-18", "pillar": "social", "category": "Bienestar y satisfacción",
    "metric": "Índice de confianza / autoestima académica",
    "definition": "<p>Mide el cambio en la autopercepción académica del estudiante: qué tan capaz, seguro y motivado se siente para enfrentar sus materias. Se aplica una encuesta antes de iniciar el programa (línea base) y al finalizar el período.</p><div class='def-block formula'><strong>¿Cómo se calcula?</strong> Porcentaje de estudiantes que reportan sentirse 'seguros' o 'muy seguros' en sus materias en la medición post-programa. El valor del 78% significa que 4 de cada 5 estudiantes terminan el ciclo sintiendo mayor confianza académica.</div><div class='def-block why'><strong>¿Por qué importa?</strong> La autoestima académica es un predictor de rendimiento futuro independiente de las notas actuales. Un estudiante que cree en sus capacidades dedica más tiempo al estudio, enfrenta mejor los exámenes y tiene mayor probabilidad de continuar su trayectoria educativa. Es un indicador de impacto psicológico y emocional del programa.</div>",
    "stakeholder": "Estudiantes", "ods": [4], "gri": [], "alignment": "Sin estandar directo", "lbg": "Outcome",
    "source": "Encuesta pre/post", "frequency": "Semestral",
    "value": 78, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+5%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-19", "pillar": "social", "category": "Bienestar y satisfacción",
    "metric": "Horas semanales liberadas a colaboradores",
    "definition": "<p>Mide cuántas horas por semana dejaron de dedicar los colaboradores-padres al acompañamiento académico directo de sus hijos: supervisión de tareas, explicación de materias y gestión de la agenda educativa del hogar. Se mide mediante encuesta comparativa antes y después del programa.</p><div class='def-block formula'><strong>¿Cómo automatizarlo?</strong> Este indicador puede capturarse de forma automática integrando dos momentos en el flujo de la plataforma: (1) Encuesta de onboarding al padre/madre al inscribir a su hijo, preguntando cuántas horas semanales dedica actualmente al apoyo académico. (2) Encuesta de seguimiento a los 3 y 6 meses. La plataforma genera automáticamente el delta y calcula la mediana del grupo. Al ser parte del flujo de inscripción, no requiere campañas de encuesta separadas.</div><div class='def-block why'><strong>¿Por qué importa para la empresa?</strong> Cada hora recuperada puede ser dedicada al trabajo o al descanso, con impacto en productividad y bienestar. Es el complemento cualitativo al cálculo de productividad de S-34 y S-35, que usa el modelo 2:1 basado en horas de tutoría contratadas.</div>",
    "stakeholder": "Colaboradores", "ods": [8], "gri": ["401-2","203-2"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Encuesta a colaboradores + Calculadora Productividad", "frequency": "Semestral",
    "value": 8, "unit": "h/sem", "live": true, "format": "dec1",
    "trendLabel": "+2h", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-20", "pillar": "social", "category": "Bienestar y satisfacción",
    "metric": "Testimonios cualitativos documentados",
    "definition": "<p>Número de historias de impacto documentadas y verificadas, recopiladas de estudiantes, padres y Luteachers. Cada testimonio incluye contexto (quién, cuándo, qué materia), el desafío inicial, el proceso y el resultado concreto (por ejemplo: 'Pasó de reprobar Matemáticas a obtener 16/20 en el examen final').</p><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> Los datos cuantitativos demuestran la escala del impacto; los testimonios cualitativos muestran el impacto humano real. Ambos son necesarios para un reporte ESG completo según los estándares GRI y para comunicar el valor del programa a inversores, clientes y medios de comunicación. Los testimonios verificados también se usan en pitches de renovación de contrato.</div>",
    "stakeholder": "Todos", "ods": [], "gri": [], "alignment": "Sin estandar directo", "lbg": "Output",
    "source": "Módulo 'Testimonios'", "frequency": "Trimestral",
    "value": 12, "unit": "casos", "live": false, "format": "int",
    "trendLabel": "+3", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-21", "pillar": "social", "category": "Igualdad de género y diversidad",
    "metric": "% estudiantes mujeres",
    "definition": "<p>Proporción de estudiantes mujeres sobre el total de estudiantes registrados en el programa, incluyendo activos e históricos.</p><div class='def-block formula'><strong>Fórmula:</strong> (N° de estudiantes mujeres ÷ Total de estudiantes inscritos S-00) × 100</div><p>Un 62.5% indica que la mayoría de los beneficiarios del programa son mujeres, lo cual es positivo desde la perspectiva de inclusión de género. Al considerar el total registrado en lugar de solo los activos, la métrica refleja la composición real del programa a lo largo del tiempo.</p><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> La paridad en el acceso a la educación es un principio fundamental del ODS 5 (Igualdad de Género) y el ODS 4 (Educación de Calidad). GRI 405-1 exige reportar la distribución de género entre los grupos de interés del programa. Si la cifra fuera significativamente menor al 50%, podría indicar barreras de acceso para niñas o sesgos en el diseño del programa.</div>",
    "stakeholder": "Estudiantes", "ods": [5], "gri": ["405-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Perfil de beneficiarios'", "frequency": "Mensual",
    "value": 62.5, "unit": "%", "live": true, "format": "dec1",
    "trendLabel": "+1.5%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-23", "pillar": "social", "category": "Igualdad de género y diversidad",
    "metric": "% Luteachers mujeres",
    "definition": "<p>Representación femenina en la plantilla de tutores universitarios activos de Luteach durante el período.</p><div class='def-block formula'><strong>Fórmula:</strong> (N° de Luteachers mujeres ÷ Total de Luteachers activos) × 100</div><div class='def-block why'><strong>¿Por qué importa?</strong> Las tutoras mujeres son modelos de rol especialmente valiosos para las estudiantes, en particular en materias STEM donde las mujeres han estado históricamente subrepresentadas. Un 58.3% (mayoría femenina en el equipo docente) es un diferenciador positivo que Luteach puede destacar en su reporte GRI 405-1 (Diversidad en empleados y colaboradores) y que refuerza el compromiso con el ODS 5.</div>",
    "stakeholder": "Luteachers", "ods": [5], "gri": ["405-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Perfil de Luteachers'", "frequency": "Mensual",
    "value": 58.3, "unit": "%", "live": true, "format": "dec1",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-24", "pillar": "social", "category": "Igualdad de género y diversidad",
    "metric": "% beneficiarios de comunidades vulnerables",
    "definition": "<p>Porcentaje de beneficiarios que provienen de contextos de vulnerabilidad socioeconómica: zonas periféricas, familias de bajos ingresos, comunidades con acceso históricamente limitado a educación de calidad o grupos subrepresentados.</p><p>La clasificación se realiza según el módulo de segmentación, usando datos proporcionados por la empresa cliente (RRHH) y/o declaración voluntaria del beneficiario.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Distingue entre un programa que solo beneficia a empleados de altos ingresos vs. uno con genuino impacto en equidad social. Un 34% indica que más de 1 de cada 3 estudiantes proviene de un contexto vulnerable, lo que justifica el indicador ODS 10 (Reducción de Desigualdades) y da mayor credibilidad al reporte ESG de la empresa cliente.</div>",
    "stakeholder": "Comunidad", "ods": [10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Segmentación'", "frequency": "Trimestral",
    "value": 34, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+2%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-25", "pillar": "social", "category": "Desarrollo de talento joven",
    "metric": "Luteachers activos",
    "definition": "<p>Número de tutores universitarios que han dictado al menos una sesión durante el período. Un Luteacher es un estudiante universitario con buen rendimiento académico (promedio generalmente superior a 15/20 o equivalente) seleccionado y formado por Luteach para enseñar materias en las que tiene dominio comprobado.</p><div class='def-block why'><strong>¿Por qué son importantes para ESG?</strong> Los Luteachers son simultáneamente el activo humano más crítico de Luteach (quienes entregan el servicio) y beneficiarios del programa: desarrollan experiencia laboral, habilidades pedagógicas y blandas, y generan ingresos mientras estudian. Su crecimiento refleja el doble impacto del modelo de Luteach: educar estudiantes y empoderar jóvenes universitarios.</div>",
    "stakeholder": "Luteachers", "ods": [8], "gri": ["404-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Luteachers activos'", "frequency": "Mensual",
    "value": 12, "unit": "tutores", "live": true, "format": "int",
    "trendLabel": "+2", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-26", "pillar": "social", "category": "Desarrollo de talento joven",
    "metric": "Horas de experiencia docente acumuladas",
    "definition": "<p>Suma total de horas dictadas por todos los Luteachers en el período. Funciona como proxy del capital de experiencia laboral y pedagógica generado por el programa.</p><p>Cada hora dictada equivale simultáneamente a: una hora de práctica pedagógica real, una hora de desarrollo de habilidades blandas (comunicación, liderazgo, empatía) y una hora de ingresos para el Luteacher.</p><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> Mide el impacto de Luteach sobre sus propios colaboradores-tutores. Los Luteachers son jóvenes universitarios que, al participar, construyen su trayectoria profesional antes de graduarse. GRI 404-1 reporta horas de capacitación; aquí usamos las horas dictadas como indicador equivalente de experiencia generada.</div>",
    "stakeholder": "Luteachers", "ods": [8], "gri": ["404-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Horas dictadas'", "frequency": "Mensual",
    "value": 260, "unit": "horas", "live": true, "format": "int",
    "trendLabel": "+18h", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-27", "pillar": "social", "category": "Desarrollo de talento joven",
    "metric": "% Luteachers con desarrollo de habilidades blandas",
    "definition": "<p>Porcentaje de Luteachers que, al finalizar al menos un ciclo completo con Luteach, reportan en encuesta haber mejorado significativamente sus habilidades de: comunicación efectiva, liderazgo situacional, empatía pedagógica, gestión del tiempo y resolución de conflictos.</p><div class='def-block formula'><strong>Metodología:</strong> Encuesta con escala Likert (1 a 5). Se considera 'con desarrollo' si el Luteacher reporta mejora (≥4 sobre 5) en al menos 3 de las 5 habilidades evaluadas, comparando con su autopercepción al ingresar al programa.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Enseñar es una de las formas más efectivas de desarrollar habilidades blandas: los Luteachers que pasan por el programa se convierten en profesionales con ventaja competitiva en el mercado laboral (dato que se confirma en S-28).</div>",
    "stakeholder": "Luteachers", "ods": [8], "gri": ["404-2"], "alignment": "Adaptado", "lbg": "Outcome",
    "source": "Encuesta a Luteachers", "frequency": "Semestral",
    "value": 84, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+4%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-28", "pillar": "social", "category": "Desarrollo de talento joven",
    "metric": "% Luteachers con empleo/práctica post-programa",
    "definition": "<p>Porcentaje de Luteachers que, habiendo completado al menos un ciclo con Luteach, consiguieron empleo formal o práctica pre-profesional en los 6 meses siguientes a su salida del programa.</p><div class='def-block formula'><strong>Fuente del dato:</strong> Encuesta de seguimiento enviada a egresados a los 3 y 6 meses. Se considera 'insertado' quien reporta empleo remunerado formal o práctica en una empresa reconocida.</div><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> Es el indicador de impacto de largo plazo más tangible para los Luteachers. Demuestra que el programa no solo les da ingresos mientras estudian, sino que mejora sus perspectivas laborales de manera duradera, resultado directo alineado con ODS 8 (Trabajo Decente y Crecimiento Económico) y GRI 203-2.</div>",
    "stakeholder": "Luteachers", "ods": [8], "gri": ["203-2"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Encuesta de seguimiento", "frequency": "Anual",
    "value": 71, "unit": "%", "live": false, "format": "int",
    "trendLabel": "+5%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-30", "pillar": "social", "category": "Desarrollo de talento joven",
    "metric": "Calificación promedio de Luteachers",
    "definition": "<p>Puntuación promedio que estudiantes y padres asignan a cada Luteacher al finalizar una sesión o ciclo de clases, en una escala de 1 a 5. La evaluación incluye criterios como: claridad en la explicación, dominio de la materia, puntualidad, paciencia y adaptación al ritmo del estudiante.</p><div class='def-block formula'><strong>¿Cómo se promedia?</strong> Se calcula la media ponderada de todas las evaluaciones recibidas en el período, ponderando por número de sesiones dictadas por Luteacher.</div><div class='def-block goal'><strong>Umbrales de acción:</strong> ≥4.5 Luteacher destacado, 4.0 a 4.4 nivel esperado, 3.5 a 3.9 alerta de mejora, menos de 3.5 revisión urgente y formación adicional. El promedio actual de 4.4/5 indica un equipo de alta calidad docente.</div>",
    "stakeholder": "Luteachers", "ods": [4], "gri": [], "alignment": "Sin estandar directo", "lbg": "Output",
    "source": "Módulo 'Evaluación de Luteachers'", "frequency": "Mensual",
    "value": 4.4, "unit": "/ 5", "live": true, "format": "dec1",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-31", "pillar": "social", "category": "Desarrollo comunitario y territorial",
    "metric": "Comunidades / zonas atendidas",
    "definition": "<p>Número de comunidades, barrios, municipios o distritos distintos donde existe al menos un estudiante activo en el programa durante el período. Una 'comunidad' se define como una unidad geográfica local (distrito, municipio) o una organización social específica (colegio, asociación, colectivo) registrada en el módulo de mapa de impacto.</p><div class='def-block why'><strong>¿Por qué importa?</strong> Evidencia la capilaridad territorial del programa: un mayor número de comunidades indica que el impacto no está concentrado en una sola zona urbana y que Luteach llega a lugares donde el acceso a educación de calidad es más difícil. Este indicador es clave para reportar GRI 413-1 (Operaciones con participación de comunidades locales).</div>",
    "stakeholder": "Comunidad", "ods": [10], "gri": ["413-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Mapa de impacto'", "frequency": "Trimestral",
    "value": 8, "unit": "comunidades", "live": false, "format": "int",
    "trendLabel": "+1", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-32", "pillar": "social", "category": "Desarrollo comunitario y territorial",
    "metric": "Ratio horas/becas donadas vs. modelo pagado",
    "definition": "<p>Mide qué proporción del total de horas de servicio entregadas corresponde a becas o subsidios (sin retorno comercial directo) vs. al modelo de pago por parte de la empresa cliente.</p><div class='def-block formula'><strong>Ejemplo:</strong> Un ratio del 35% significa que 35 de cada 100 horas son gratuitas o subsidiadas para familias que no podrían pagar el servicio por sus propios medios.</div><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> Diferencia el componente de responsabilidad social genuina (beca pura) del servicio comercial B2B. Para el reporte GRI 201-1 (Valor económico generado y distribuido), permite cuantificar la inversión en comunidad que va más allá del modelo de negocio y demostrar que Luteach tiene un compromiso real con la equidad de acceso.</div>",
    "stakeholder": "Empresa cliente", "ods": [], "gri": ["201-1"], "alignment": "Adaptado", "lbg": "Input",
    "source": "Módulo 'Tipo de financiamiento'", "frequency": "Trimestral",
    "value": 35, "unit": "%", "live": false, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-33", "pillar": "social", "category": "Desarrollo comunitario y territorial",
    "metric": "Valor equivalente de inversión social",
    "definition": "<p>Monetiza el impacto total del programa convirtiendo todas las horas de tutoría entregadas (pagadas + en beca) a su equivalente en dinero usando la tarifa de mercado local para tutoría especializada.</p><div class='def-block formula'><strong>Fórmula:</strong> Total horas dictadas (S-04) × tarifa promedio de tutoría por hora en el mercado local (sin incluir el descuento por volumen del contrato).</div><div class='def-block why'><strong>¿Para qué sirve?</strong> Permite a la empresa cliente incluir en su reporte de sostenibilidad una cifra monetaria de inversión social total, formato reconocido por GRI 201-1 y el modelo LBG (London Benchmarking Group). Facilita la comparación con otras empresas del sector y con años anteriores, y es el dato que más impacto tiene en presentaciones a directivos y consejos de administración.</div>",
    "stakeholder": "Empresa cliente", "ods": [], "gri": ["201-1","203-1"], "alignment": "Adaptado", "lbg": "Input",
    "source": "Calculado: horas × tarifa", "frequency": "Anual",
    "value": 18200, "unit": "", "live": false, "format": "currency",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-34", "pillar": "social", "category": "Productividad del colaborador",
    "metric": "Horas de productividad potencialmente recuperadas",
    "definition": "<p>Total de horas de productividad que los colaboradores-padres recuperan gracias al programa Luteach. Se calcula con el modelo 2:1: por cada hora de tutoría contratada, el padre recupera 2 horas de tiempo, porque en promedio un padre tarda el doble que un Luteacher en explicar el mismo concepto a su hijo.</p><div class='def-block formula'><strong>Fórmula:</strong> Horas de tutoría contratadas (S-03) × 2<br><br>Si la empresa contrató 520 horas de tutoría, los colaboradores-padres recuperan un estimado de 1.040 horas de tiempo productivo durante el mismo período. Este ratio ha sido validado en estudios sobre acompañamiento académico parental: el tiempo que un padre sin formación pedagógica dedica a explicar una materia es sistemáticamente mayor al de un tutor especializado.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Es el principal argumento de ROI del programa para RRHH: cada hora de tutoría pagada genera el doble de valor en tiempo recuperado del colaborador. Junto con el costo por hora del colaborador (S-35), permite calcular el retorno financiero directo del programa.</div>",
    "stakeholder": "Colaboradores / Empresa cliente", "ods": [8], "gri": ["401-2","203-2"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Calculadora Productividad", "frequency": "Anual",
    "value": 480, "unit": "horas", "live": false, "format": "int",
    "trendLabel": "+12%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-35", "pillar": "social", "category": "Productividad del colaborador",
    "metric": "Valor monetario estimado de productividad recuperada",
    "definition": "<p>Convierte las horas de productividad recuperadas (S-34) a valor monetario usando el costo promedio por hora del colaborador. Este costo lo ingresa el área de RRHH de la empresa cliente, ya que depende de la estructura salarial específica de cada organización.</p><div class='def-block formula'><strong>Fórmula:</strong> Horas recuperadas (S-34) × costo promedio por hora del colaborador (ingresado por RRHH en S-36)<br><br>El costo por hora puede calcularse como: salario mensual bruto ÷ horas laborables mensuales. Algunas empresas incluyen también cargas sociales y beneficios para un cálculo de costo total del empleado.</div><div class='def-block why'><strong>¿Para qué sirve?</strong> Permite al área de RRHH presentar al Comité de Dirección el ROI financiero del programa: si el programa cuesta X y genera productividad por valor de Y, el caso de negocio es cuantificable y comparable. Es el dato más frecuente para impulsar la renovación del contrato. El valor depende directamente del salario promedio de los colaboradores beneficiarios.</div>",
    "stakeholder": "Empresa cliente", "ods": [8], "gri": ["203-2"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Calculadora Productividad", "frequency": "Anual",
    "value": 16800, "unit": "", "live": false, "format": "currency",
    "trendLabel": "+12%", "trendUp": true, "trendGood": true
  },
  {
    "id": "S-36", "pillar": "social", "category": "Productividad del colaborador",
    "metric": "Calculadora de productividad parental (ratio 2:1)",
    "definition": "<p>Calculadora de productividad parental basada en el modelo 2:1 de Luteach: por cada hora de tutoría contratada, el colaborador-padre recupera 2 horas de tiempo productivo, porque en promedio tarda el doble del Luteacher en explicar el mismo tema a su hijo.</p><div class='def-block formula'><strong>Fórmula:</strong> Horas contratadas (S-03, del sistema) × 2 = Horas recuperadas, × Costo por hora del colaborador (ingresado por RRHH) = Valor económico recuperado.<br><br>El costo por hora lo ingresa el área de RRHH de la empresa cliente, ya que depende de la estructura salarial de cada organización. El dato de horas contratadas se sincroniza automáticamente desde el módulo de compra de horas.</div><div class='def-block why'><strong>¿Por qué el ratio 2:1?</strong> Un padre sin formación pedagógica especializada tarda en promedio el doble de tiempo que un tutor en transmitir el mismo concepto, porque necesita recordar el contenido, encontrar el enfoque correcto y manejar la dinámica emocional del aprendizaje con su propio hijo. Luteach reemplaza ese tiempo con eficiencia pedagógica.</div>",
    "stakeholder": "Colaboradores", "ods": [8], "gri": ["401-2","203-2"], "alignment": "Adaptado", "lbg": "Impact",
    "source": "Calculadora Productividad Parental Luteach", "frequency": "Mensual",
    "value": null, "unit": "", "live": true, "format": "none", "isCalculator": true,
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "G-01", "pillar": "gobernanza", "category": "Protección y cumplimiento",
    "metric": "% Luteachers con verificación de antecedentes",
    "definition": "<p>Porcentaje de Luteachers activos que han completado el proceso de verificación de seguridad antes de ser habilitados para dar clases a estudiantes menores de edad. Este proceso es parte del protocolo de <strong>safeguarding</strong> (protección de menores) de Luteach.</p><p>El proceso incluye: (1) Verificación de identidad, (2) Certificado de antecedentes penales y policiales, (3) Firma del código de conducta (G-03), (4) Revisión básica de presencia en redes sociales.</p><div class='def-block goal'><strong>Meta permanente: 100%.</strong> Ningún Luteacher puede ser asignado a un estudiante sin haber completado este proceso íntegramente. Un 98% o menos activa una alerta inmediata de compliance.</div><div class='def-block why'><strong>¿Por qué importa para ESG?</strong> La protección de menores es el pilar de gobernanza más crítico de Luteach. Una falla en este proceso puede tener consecuencias legales, regulatorias, reputacionales y, sobre todo, humanas severas. GRI 2-23 y 414-1 exigen políticas y compromisos formales en materia de derechos humanos y debida diligencia.</div>",
    "stakeholder": "Luteachers", "ods": [], "gri": ["2-23","414-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Módulo 'Onboarding Luteachers'", "frequency": "Mensual",
    "value": 100, "unit": "%", "live": true, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "G-02", "pillar": "gobernanza", "category": "Protección y cumplimiento",
    "metric": "Incidentes de protección de datos",
    "definition": "<p>Número de incidentes de seguridad o privacidad relacionados con datos personales de estudiantes, padres o Luteachers ocurridos en el período. Un incidente incluye: acceso no autorizado, fuga de información, pérdida de datos o uso indebido de información personal.</p><div class='def-block goal'><strong>Meta permanente: 0 incidentes.</strong> Luteach maneja datos de menores de edad, lo que implica obligaciones reforzadas bajo: Ley 29733 (Perú), LGPD (Brasil), LOPD-GDD (España) y el RGPD europeo. Cualquier incidente confirmado debe ser notificado a la autoridad competente en un máximo de 72 horas.</div><div class='def-block why'><strong>¿Por qué importa?</strong> La confianza de las familias y las empresas clientes depende de la seguridad absoluta de los datos de los menores. Un solo incidente puede comprometer contratos, reputación y la continuidad del negocio. GRI 418-1 exige reportar el número de reclamaciones fundamentadas relacionadas con la privacidad de datos de clientes.</div>",
    "stakeholder": "Todos", "ods": [], "gri": ["418-1"], "alignment": "Directo", "lbg": "Output",
    "source": "Módulo 'Compliance'", "frequency": "Trimestral",
    "value": 0, "unit": "incidentes", "live": true, "format": "int",
    "trendLabel": "meta: 0", "trendUp": false, "trendGood": true
  },
  {
    "id": "G-03", "pillar": "gobernanza", "category": "Protección y cumplimiento",
    "metric": "% Luteachers con código de conducta firmado",
    "definition": "<p>Porcentaje de Luteachers activos que han firmado digitalmente el Código de Conducta de Luteach. El código establece las normas de comportamiento obligatorias para toda interacción con estudiantes y familias.</p><p>El código incluye compromisos sobre: (1) Prohibición de contacto con menores fuera de la plataforma oficial, (2) Lenguaje y comportamiento adecuado durante sesiones, (3) Protocolo de reporte de situaciones irregulares, (4) Confidencialidad total de información de familias, (5) Consecuencias del incumplimiento (desactivación inmediata y posible reporte legal).</p><div class='def-block goal'><strong>Meta permanente: 100%.</strong> Junto con G-01 (verificación de antecedentes), el código de conducta firmado es un requisito previo para comenzar a dictar clases. Ambos indicadores forman el núcleo del protocolo de safeguarding de Luteach, reportado bajo GRI 2-23 y 2-24.</div>",
    "stakeholder": "Luteachers", "ods": [], "gri": ["2-23","2-24"], "alignment": "Directo", "lbg": "Output",
    "source": "Módulo 'Onboarding Luteachers'", "frequency": "Mensual",
    "value": 98, "unit": "%", "live": false, "format": "int",
    "trendLabel": "", "trendUp": true, "trendGood": true
  },
  {
    "id": "G-05", "pillar": "gobernanza", "category": "Transparencia y trazabilidad",
    "metric": "Casos atendidos en canal de feedback",
    "definition": "<p>Número total de comunicaciones gestionadas por el canal de soporte de Luteach en el período: incluye reclamos, sugerencias, consultas, reportes de incidentes y solicitudes de cambio. Cada caso es categorizado, asignado a un responsable y resuelto con un tiempo objetivo (SLA).</p><p>Los canales disponibles son: chat en plataforma, correo electrónico, WhatsApp Business y formulario web. Todos los casos son centralizados en el sistema de soporte y tienen trazabilidad completa.</p><div class='def-block why'><strong>¿Por qué importa para GRI?</strong> Los estándares GRI 2-25 y 2-26 exigen que las organizaciones tengan mecanismos formales, accesibles y efectivos para que los stakeholders reporten preocupaciones y reciban respuesta oportuna. Este indicador demuestra que Luteach no solo tiene el canal, sino que lo usa activamente. Un número de casos creciente (bien gestionado) es una señal de confianza y transparencia, no de problema.</div>",
    "stakeholder": "Todos", "ods": [], "gri": ["2-25","2-26"], "alignment": "Directo", "lbg": "Output",
    "source": "Módulo 'Soporte / Feedback'", "frequency": "Mensual",
    "value": 4, "unit": "casos", "live": true, "format": "int",
    "trendLabel": "+1", "trendUp": true, "trendGood": true
  },
  {
    "id": "E-01", "pillar": "ambiental", "category": "Huella ambiental",
    "metric": "Huella de carbono por uso de dispositivos",
    "definition": "<p>Calcula el CO₂ equivalente (CO₂e) emitido por el consumo energético de todos los dispositivos conectados durante las sesiones de Luteach. La unidad de medición es la <strong>hora-dispositivo</strong>: cada persona conectada (tutor o estudiante) genera 1 hora-dispositivo por cada hora de sesión. Los datos de sesiones se sincronizan automáticamente desde el sistema.</p><div class='def-block formula'><strong>Fórmula por tipo de sesión:</strong><br><br>Sesión individual (1:1): 1 hora = 2 horas-dispositivo (tutor + 1 estudiante)<br>Sesión grupal (N estudiantes): 1 hora = (N + 1) horas-dispositivo<br>Ejemplo: 2h individual + 1h grupal de 3 est. = 4 + 4 = 8 horas-dispositivo totales<br><br>kWh dispositivos = total h-disp × 0.045 kWh/h<br>kWh plataforma = horas totales × 0.05 kWh/h (servidor de streaming)<br>CO₂e = (kWh dispositivos + kWh plataforma) × Factor_emisión + CO₂ transporte presencial<br><br><strong>Datos del sistema:</strong> El desglose de sesiones individuales vs. grupales, y el promedio de estudiantes por sesión grupal, provienen del módulo de gestión de sesiones de Luteach.</div><div class='def-block why'><strong>¿Por qué horas-dispositivo?</strong> Esta metodología refleja la realidad física: una sesión grupal con 3 estudiantes consume 4 veces más energía eléctrica que una sesión individual, porque hay 4 laptops encendidas en vez de 2. El consumo de energía es proporcional al número de personas conectadas, no al tipo de sesión.</div><div class='def-block goal'><strong>Uso en reporte ESG:</strong> Permite contabilizar las emisiones Alcance 3 del programa. Los parámetros ajustables son el factor de emisión eléctrico (varía por país: Perú 0.248, España 0.181, Colombia 0.126, México 0.233 kgCO₂e/kWh) y el consumo base por dispositivo. Los datos de sesiones son automáticos.</div>",
    "stakeholder": "Todos", "ods": [13], "gri": ["305-1","302-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Sistema de sesiones (automático) + factor de emisión configurable", "frequency": "Mensual",
    "value": null, "unit": "kgCO₂e", "live": false, "format": "none",
    "isCalculator": true, "calcType": "carbon",
    "trendLabel": "", "trendUp": false, "trendGood": false
  },
  {
    "id": "E-03", "pillar": "ambiental", "category": "Huella ambiental",
    "metric": "Consumo energético de la plataforma",
    "definition": "<p>Estimado del consumo energético de la infraestructura tecnológica de Luteach (servidores de aplicación, streaming de video bidireccional, almacenamiento en la nube) expresado en kWh por hora de clase dictada.</p><div class='def-block formula'><strong>Metodología:</strong> Se trabaja con el proveedor de servicios cloud para obtener datos de consumo real o estimado según el tipo de instancia utilizada, la región del servidor y las horas de uso. Para videoconferencias de alta definición bidireccionales, el promedio estimado es de 0.8 kWh por hora de clase.</div><div class='def-block why'><strong>¿Por qué importa?</strong> Las operaciones en la nube no son neutras en carbono por defecto: cada hora de clase virtual consume energía de centros de datos. Monitorear este consumo permite a Luteach establecer metas de reducción (migración a data centers con energía renovable, optimización de codecs de video) y reportarlo bajo GRI 302-1 (Consumo de energía dentro de la organización). Una reducción de 0.1 kWh/h equivale a decenas de kWh ahorrados al año.</div>",
    "stakeholder": "-", "ods": [], "gri": ["302-1"], "alignment": "Adaptado", "lbg": "Output",
    "source": "Estimado con proveedor cloud", "frequency": "Anual",
    "value": 0.8, "unit": "kWh/h", "live": false, "format": "dec1",
    "trendLabel": "-0.1", "trendUp": false, "trendGood": true
  }
];
