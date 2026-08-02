import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { EducacionDto } from '../modelo/educacion.dto';
import { ExperienciaDto } from '../modelo/experiencia.dto';
import { HabilidadDto } from '../modelo/habilidad.dto';
import { Persona } from '../modelo/persona';
import { ProyectoDto } from '../modelo/proyecto.dto';
import { Redsocial } from '../modelo/redsocial';
import { TipoHabilidad } from '../modelo/tipo-habilidad';
import { formatPeriodoRango, parsePeriodoFecha } from './periodo.util';

export interface CvAtsInput {
  persona: Persona;
  educacion: EducacionDto[];
  experiencia: ExperienciaDto[];
  proyecto: ProyectoDto[];
  habilidades: HabilidadDto[];
  redes: Redsocial[];
  tipoHabilidad: TipoHabilidad[];
}

const ATS_FONT = 'Roboto';
const ATS_SECTION_COLOR = '#2c3e50';
const ATS_SECTION_LINE_COLOR = '#d0d4d8';
/** Ancho util A4 con margenes de 48pt a cada lado. */
const CONTENT_WIDTH = 499;
const SECTION_GAP = 10;
const BODY_SIZE = 10;
const TITLE_SIZE = 18;
const SECTION_SIZE = 11;

export function buildCvFilename(persona: Persona): string {
  const slug = `${persona.nombre}-${persona.apellido}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `CV_${slug || 'portfolio'}.pdf`;
}

export function buildCvAtsDocument(data: CvAtsInput): TDocumentDefinitions {
  const fullName = `${data.persona.nombre} ${data.persona.apellido}`.trim();
  const contactLine = buildContactLine(data.redes);
  const content: Content[] = [
    { text: fullName, style: 'name' },
    { text: data.persona.profesion, style: 'headline' },
  ];

  if (contactLine) {
    content.push({ text: contactLine, style: 'contact', margin: [0, 2, 0, SECTION_GAP] });
  } else {
    content.push({ text: '', margin: [0, 0, 0, SECTION_GAP] });
  }

  const summary = normalizeText(data.persona.acercaDe);
  if (summary) {
    content.push(...sectionBlock('RESUMEN PROFESIONAL', [{ text: summary, style: 'body' }]));
  }

  const experiencia = sortByFechaDesc(data.experiencia);
  if (experiencia.length) {
    content.push(
      ...sectionBlock(
        'EXPERIENCIA LABORAL',
        experiencia.flatMap(item => buildExperienciaEntry(item))
      )
    );
  }

  const educacion = sortByFechaDesc(data.educacion);
  if (educacion.length) {
    content.push(
      ...sectionBlock(
        'EDUCACION',
        educacion.flatMap(item => buildEducacionEntry(item))
      )
    );
  }

  const skillsBlock = buildSkillsBlock(data.habilidades, data.tipoHabilidad);
  if (skillsBlock.length) {
    content.push(...sectionBlock('HABILIDADES', skillsBlock));
  }

  const proyectos = sortByFechaDesc(data.proyecto);
  if (proyectos.length) {
    content.push(
      ...sectionBlock(
        'PROYECTOS',
        proyectos.flatMap(item => buildProyectoEntry(item))
      )
    );
  }

  return {
    pageSize: 'A4',
    pageMargins: [48, 48, 48, 48],
    defaultStyle: {
      font: ATS_FONT,
      fontSize: BODY_SIZE,
      lineHeight: 1.25,
      color: '#111111',
    },
    styles: {
      name: {
        fontSize: TITLE_SIZE,
        bold: true,
        margin: [0, 0, 0, 2],
      },
      headline: {
        fontSize: 12,
        margin: [0, 0, 0, 4],
      },
      contact: {
        fontSize: 9,
        color: '#333333',
      },
      sectionTitle: {
        fontSize: SECTION_SIZE,
        bold: true,
        color: ATS_SECTION_COLOR,
        margin: [0, SECTION_GAP, 0, 3],
        characterSpacing: 0.3,
      },
      entryTitle: {
        bold: true,
        fontSize: BODY_SIZE,
        margin: [0, 4, 0, 1],
      },
      entryMeta: {
        fontSize: 9,
        color: '#444444',
        margin: [0, 0, 0, 2],
      },
      body: {
        fontSize: BODY_SIZE,
        margin: [0, 0, 0, 2],
      },
      bullet: {
        fontSize: BODY_SIZE,
        margin: [0, 0, 0, 1],
      },
    },
    content,
  };
}

function sectionBlock(title: string, body: Content[]): Content[] {
  return [
    { text: title, style: 'sectionTitle' },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: CONTENT_WIDTH,
          y2: 0,
          lineWidth: 0.5,
          lineColor: ATS_SECTION_LINE_COLOR,
        },
      ],
      margin: [0, 0, 0, 6],
    },
    ...body,
  ];
}

function buildContactLine(redes: Redsocial[]): string {
  return redes
    .filter(red => red.link?.trim())
    .map(red => {
      const label = (red.nombreRedS || 'Contacto').trim();
      const link = red.link.trim();
      if (link.toLowerCase().startsWith('mailto:')) {
        return link.replace(/^mailto:/i, '');
      }
      return `${label}: ${link}`;
    })
    .join(' | ');
}

function buildExperienciaEntry(item: ExperienciaDto): Content[] {
  const org = item.organizacion?.nombre?.trim();
  const title = item.nombreE?.trim() || 'Experiencia';
  const metaParts = [
    org,
    item.tipoUbicacion?.nombre,
    item.tipoEmpleo?.nombre,
    formatPeriodoRango(item.fechaInicio, item.fechaFin, item.esActual),
  ].filter(Boolean);

  const block: Content[] = [
    { text: title, style: 'entryTitle' },
    { text: metaParts.join(' | '), style: 'entryMeta' },
    ...buildDescriptionBullets(item.descripcionE),
  ];

  const skills = skillNames(item.habilidades);
  if (skills) {
    block.push({ text: `Tecnologias: ${skills}`, style: 'entryMeta' });
  }

  return block;
}

function buildEducacionEntry(item: EducacionDto): Content[] {
  const org = item.organizacion?.nombre?.trim();
  const title = item.nombreE?.trim() || 'Formacion';
  const metaParts = [
    org,
    item.tipoEducacion?.nombre,
    formatPeriodoRango(item.fechaInicio, item.fechaFin, false),
  ].filter(Boolean);

  const block: Content[] = [
    { text: title, style: 'entryTitle' },
    { text: metaParts.join(' | '), style: 'entryMeta' },
    ...buildDescriptionBullets(item.descripcionE),
  ];

  const skills = skillNames(item.habilidades);
  if (skills) {
    block.push({ text: `Tecnologias: ${skills}`, style: 'entryMeta' });
  }

  return block;
}

function buildProyectoEntry(item: ProyectoDto): Content[] {
  const title = item.nombreE?.trim() || 'Proyecto';
  const metaParts = [
    item.organizacion?.nombre,
    formatPeriodoRango(item.fechaInicio, item.fechaFin, item.esActual),
  ].filter(Boolean);

  const block: Content[] = [
    { text: title, style: 'entryTitle' },
    { text: metaParts.join(' | '), style: 'entryMeta' },
    ...buildDescriptionBullets(item.descripcionE),
  ];

  const skills = skillNames(item.habilidades);
  if (skills) {
    block.push({ text: `Tecnologias: ${skills}`, style: 'entryMeta' });
  }

  if (item.link?.trim()) {
    block.push({ text: `Enlace: ${item.link.trim()}`, style: 'entryMeta' });
  }

  return block;
}

function buildSkillsBlock(
  habilidades: HabilidadDto[],
  tipos: TipoHabilidad[]
): Content[] {
  if (!habilidades.length) {
    return [];
  }

  const tipoOrder = new Map(tipos.map((tipo, index) => [tipo.id, index]));
  const grouped = new Map<string, string[]>();

  [...habilidades]
    .sort((a, b) => {
      const tipoA = a.tipoHabilidad?.id ?? a.tipoHabilidadId ?? 0;
      const tipoB = b.tipoHabilidad?.id ?? b.tipoHabilidadId ?? 0;
      const orderA = tipoOrder.get(tipoA) ?? 999;
      const orderB = tipoOrder.get(tipoB) ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.nombre.localeCompare(b.nombre, 'es');
    })
    .forEach(skill => {
      const group = skill.tipoHabilidad?.nombre?.trim() || 'General';
      const names = grouped.get(group) ?? [];
      names.push(skill.nombre.trim());
      grouped.set(group, names);
    });

  if (grouped.size === 1 && grouped.has('General')) {
    const flat = grouped.get('General')!.join(', ');
    return [{ text: flat, style: 'body' }];
  }

  return Array.from(grouped.entries()).map(([group, names]) => ({
    text: [{ text: `${group}: `, bold: true }, names.join(', ')],
    style: 'body',
  }));
}

function buildDescriptionBullets(text: string | null | undefined): Content[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const lines = normalized
    .split(/\r?\n+/)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [{ text: lines[0] ?? normalized, style: 'body' }];
  }

  return [
    {
      ul: lines,
      style: 'bullet',
      margin: [0, 0, 0, 2],
    },
  ];
}

function skillNames(skills: HabilidadDto[] | undefined): string {
  return (skills ?? [])
    .map(skill => skill.nombre?.trim())
    .filter(Boolean)
    .join(', ');
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sortByFechaDesc<T extends { fechaInicio: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = parsePeriodoFecha(a.fechaInicio);
    const dateB = parsePeriodoFecha(b.fechaInicio);
    if (!dateA && !dateB) {
      return 0;
    }
    if (!dateA) {
      return 1;
    }
    if (!dateB) {
      return -1;
    }
    if (dateA.year !== dateB.year) {
      return dateB.year - dateA.year;
    }
    return dateB.month - dateA.month;
  });
}
