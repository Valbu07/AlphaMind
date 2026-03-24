// src/services/pdfService.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Paleta corporativa
const C = {
  azul:        [30,  58,  138],
  azulClaro:   [96,  165, 250],
  azulPalido:  [219, 234, 254],
  verde:       [16,  185, 72],
  verdePalido: [209, 250, 229],
  amarillo:    [250, 202, 119],
  amarilloPal: [254, 243, 199],
  rojo:        [220, 38,  38],
  rojoPalido:  [254, 226, 226],
  gris:        [100, 116, 139],
  grisPalido:  [241, 245, 249],
  blanco:      [255, 255, 255],
  negro:       [15,  23,  42],
};

//  Helpers

const roundRect = (doc, x, y, w, h, fill) => {
  doc.setFillColor(...fill);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
};

const barraProgreso = (doc, x, y, w, h, pct, colorFill, colorBg = C.grisPalido) => {
  roundRect(doc, x, y, w, h, colorBg);
  const fill = Math.max(0, Math.min(1, pct / 100));
  if (fill > 0) roundRect(doc, x, y, w * fill, h, colorFill);
};

const badge = (doc, x, y, label, bg, fg) => {
  const pad = 3, fs = 8;
  doc.setFontSize(fs);
  const tw = doc.getTextWidth(label);
  roundRect(doc, x, y - fs * 0.7, tw + pad * 2, fs * 1.4, bg);
  doc.setTextColor(...fg);
  doc.setFont('helvetica', 'bold');
  doc.text(label, x + pad, y + fs * 0.15);
};

const calcBadge = (pct) => {
  if (pct >= 80) return { label: 'EXCELENTE', bg: C.verdePalido, fg: C.verde };
  if (pct >= 50) return { label: 'REGULAR',   bg: C.amarilloPal, fg: [180, 120, 0] };
  return               { label: 'CRÍTICO',    bg: C.rojoPalido,  fg: C.rojo };
};

//  Clase principal
class PDFService {

  constructor() {
    this.doc        = null;
    this.pageWidth  = 210;
    this.pageHeight = 297;
    this.margin     = 18;
    this.contentW   = 210 - 18 * 2;
  }

  inicializarDocumento() {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  }

  //. Encabezado
  agregarEncabezado(usuario, fechaGeneracion, mesLabel) {
    const doc = this.doc;
    const m   = this.margin;

    // Banda azul superior
    doc.setFillColor(...C.azul);
    doc.rect(0, 0, this.pageWidth, 38, 'F');

    // Título empresa
    doc.setFontSize(15);
    doc.setTextColor(...C.blanco);
    doc.setFont('helvetica', 'bold');
    doc.text('ALPHAMIND · CDA CEDIPLUS SOACHA', this.pageWidth / 2, 13, { align: 'center' });

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Desempeño Individual', this.pageWidth / 2, 20, { align: 'center' });

    // Mes o todos los meses
    const mesTexto = mesLabel ? `Mes: ${mesLabel}` : 'Mes: Todos los meses';
    doc.setFontSize(9);
    doc.text(mesTexto, this.pageWidth / 2, 27, { align: 'center' });

    // Tarjeta info funcionario
    roundRect(doc, m, 42, this.contentW, 18, C.grisPalido);
    doc.setFontSize(10);
    doc.setTextColor(...C.negro);
    doc.setFont('helvetica', 'bold');
    doc.text('Funcionario:', m + 4, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(usuario.nombre || 'N/D', m + 32, 53);

    doc.setFont('helvetica', 'bold');
    doc.text('Documento:', m + 90, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(String(usuario.num_documento || 'N/D'), m + 117, 53);

    doc.setFont('helvetica', 'bold');
    doc.text('Generado:', m + 4, 57);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaGeneracion, m + 24, 57);

    return 68;
  }

  // KPIs en tabla simple
agregarKPIs(metricas, yPos) {
    const doc = this.doc;
    const m   = this.margin;
    const { tareasTotales, completadas, pendientes, atrasadas } = metricas;
    const pct = tareasTotales > 0 ? (completadas / tareasTotales) * 100 : 0;

    // Título sección
    doc.setFontSize(12);
    doc.setTextColor(...C.azul);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Resumen de Desempeño', m, yPos);
    doc.setDrawColor(...C.azulClaro);
    doc.setLineWidth(0.4);
    doc.line(m, yPos + 1.5, m + this.contentW, yPos + 1.5);
    yPos += 7;

    // Tabla de métricas
    autoTable(doc, {
      startY: yPos,
      head: [['Indicador', 'Valor']],
      body: [
        ['Tareas totales asignadas',  tareasTotales.toString()],
        ['Tareas completadas',        completadas.toString()],
        ['Tareas pendientes',         pendientes.toString()],
        ['Tareas atrasadas',          atrasadas.toString()],
        ['Eficiencia global (%)',     `${pct.toFixed(1)}%`],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: C.azul, textColor: 255,
        fontSize: 10, fontStyle: 'bold', halign: 'center',
      },
      bodyStyles: { fontSize: 10, halign: 'center' },
      columnStyles: {
        0: { halign: 'left', cellPadding: { left: 4 }, cellWidth: 120 },
        1: { cellWidth: 'auto' },
      },
      alternateRowStyles: { fillColor: C.grisPalido },
      margin: { left: m, right: m },
    });

    yPos = doc.lastAutoTable.finalY + 6;

    // Barra de eficiencia — solo porcentaje, sin badge
    doc.setFontSize(9);
    doc.setTextColor(...C.negro);
    doc.setFont('helvetica', 'bold');
    doc.text('Eficiencia global:', m, yPos + 3.5);
    const barX = m + 32, barW = this.contentW - 32 - 16;
    barraProgreso(doc, barX, yPos, barW, 5, pct,
      pct >= 80 ? C.verde : pct >= 50 ? C.amarillo : C.rojo);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.negro);
    doc.text(`${pct.toFixed(1)}%`, barX + barW + 3, yPos + 3.8);

    return yPos + 14;
  }

  // Análisis de eficiencia
  agregarAnalisisEficiencia(metricas, completadasMes, yPos) {
    const doc = this.doc;
    const m   = this.margin;
    const { tareasTotales, completadas, pendientes, atrasadas } = metricas;

    if (yPos > this.pageHeight - 70) { doc.addPage(); yPos = m; }

    doc.setFontSize(12);
    doc.setTextColor(...C.azul);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Análisis de Eficiencia', m, yPos);
    doc.setDrawColor(...C.azulClaro);
    doc.setLineWidth(0.4);
    doc.line(m, yPos + 1.5, m + this.contentW, yPos + 1.5);
    yPos += 7;

    const total = tareasTotales || 1;
    const filas = [
      ['Tasa de completitud',    `${((completadas / total) * 100).toFixed(1)}%`,  completadas >= total * 0.8 ? 'Óptimo' : completadas >= total * 0.5 ? 'Aceptable' : 'Bajo'],
      ['Tasa de atraso',         `${((atrasadas  / total) * 100).toFixed(1)}%`,   atrasadas === 0 ? 'Sin atrasos' : atrasadas <= 2 ? 'Leve' : 'Crítico'],
      ['Carga pendiente',        `${pendientes} tarea(s)`,                          pendientes <= 3 ? 'Manejable' : pendientes <= 7 ? 'Alta' : 'Excesiva'],
      ['Tareas resueltas / total', `${completadas} / ${tareasTotales}`,             '—'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Indicador', 'Valor', 'Evaluación']],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: C.azul, textColor: 255, fontSize: 9, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fontSize: 9, halign: 'center' },
      columnStyles: { 0: { halign: 'left', cellPadding: { left: 4 } } },
      alternateRowStyles: { fillColor: C.grisPalido },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          const v = data.cell.raw;
          if (v === 'Óptimo' || v === 'Sin atrasos' || v === 'Manejable')
            data.cell.styles.textColor = C.verde;
          else if (v === 'Crítico' || v === 'Bajo' || v === 'Excesiva')
            data.cell.styles.textColor = C.rojo;
          else if (v !== '—')
            data.cell.styles.textColor = [160, 100, 0];
        }
      },
      margin: { left: m, right: m },
    });

    yPos = doc.lastAutoTable.finalY + 8;

    // Historial mensual
    if (completadasMes?.length > 0) {
      if (yPos > this.pageHeight - 60) { doc.addPage(); yPos = m; }

      doc.setFontSize(10);
      doc.setTextColor(...C.azul);
      doc.setFont('helvetica', 'bold');
      doc.text('Historial mensual de completitud', m, yPos);
      yPos += 4;

      const totalMeses = completadasMes.reduce((s, i) => s + i.total, 0) || 1;

      autoTable(doc, {
        startY: yPos,
        head: [['Mes', 'Completadas', '% del período']],
        body: completadasMes.map(item => [
          item.nombreMes,
          item.total.toString(),
          `${((item.total / totalMeses) * 100).toFixed(1)}%`,
        ]),
        theme: 'striped',
        headStyles: { fillColor: C.azul, textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9, halign: 'center' },
        columnStyles: { 0: { halign: 'left', cellPadding: { left: 4 } } },
        margin: { left: m, right: m },
      });

      yPos = doc.lastAutoTable.finalY + 8;
    }

    return yPos;
  }

  // Alertas
  agregarAlertas(metricas, categorias, yPos) {
    const doc = this.doc;
    const m   = this.margin;
    const { tareasTotales, completadas, atrasadas, pendientes } = metricas;

    if (yPos > this.pageHeight - 60) { doc.addPage(); yPos = m; }

    doc.setFontSize(12);
    doc.setTextColor(...C.azul);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Alertas y Puntos de Atención', m, yPos);
    doc.setDrawColor(...C.azulClaro);
    doc.setLineWidth(0.4);
    doc.line(m, yPos + 1.5, m + this.contentW, yPos + 1.5);
    yPos += 8;

    const alertas = [];
    const pct = tareasTotales > 0 ? (completadas / tareasTotales) * 100 : 0;

    if (atrasadas > 0)
      alertas.push({ severidad: 'CRÍTICO', msg: `${atrasadas} tarea(s) en estado atrasado. Requieren atención inmediata.` });

    if (pct < 50 && tareasTotales > 0)
      alertas.push({ severidad: 'ALTO',  msg: `Tasa de completitud por debajo del 50% (${pct.toFixed(0)}%). Se recomienda revisión de carga.` });
    else if (pct < 80 && tareasTotales > 0)
      alertas.push({ severidad: 'MEDIO', msg: `Tasa de completitud en ${pct.toFixed(0)}%. Hay espacio de mejora hacia el umbral óptimo (80%).` });

    if (pendientes > 5)
      alertas.push({ severidad: 'MEDIO', msg: `${pendientes} tareas pendientes acumuladas. Evaluar posible cuello de botella.` });

    if (categorias?.length > 0) {
      const top = [...categorias].sort((a, b) => b.total - a.total)[0];
      alertas.push({ severidad: 'INFO', msg: `La categoría con mayor carga es "${top.categoria}" con ${top.total} tarea(s).` });
    }

    if (alertas.length === 0)
      alertas.push({ severidad: 'OK', msg: 'No se detectaron alertas críticas. El desempeño general es satisfactorio.' });

    // Tabla de alerta
    autoTable(doc, {
      startY: yPos,
      head: [['Nivel', 'Descripción']],
      body: alertas.map(a => [a.severidad, a.msg]),
      theme: 'grid',
      headStyles: {
        fillColor: C.azul, textColor: 255,
        fontSize: 9, fontStyle: 'bold', halign: 'center',
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
        1: { halign: 'left', cellPadding: { left: 4 } },
      },
      alternateRowStyles: { fillColor: C.grisPalido },
      margin: { left: m, right: m },
    });

    return doc.lastAutoTable.finalY + 8;
  }

  // 
  // Pie de págin
  agregarPieDePagina() {
    const doc   = this.doc;
    const total = doc.internal.getNumberOfPages();

    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setDrawColor(...C.azulClaro);
      doc.setLineWidth(0.3);
      doc.line(this.margin, this.pageHeight - 13, this.pageWidth - this.margin, this.pageHeight - 13);
      doc.setFontSize(7.5);
      doc.setTextColor(...C.gris);
      doc.setFont('helvetica', 'italic');
      doc.text('Documento confidencial · CDA CEDIPLUS SOACHA · ALPHAMIND',
        this.pageWidth / 2, this.pageHeight - 8, { align: 'center' });
      doc.text(`Página ${i} de ${total}`,
        this.pageWidth - this.margin, this.pageHeight - 8, { align: 'right' });
    }
  }

  // ── Método principal ────────────────────────────────────────────────────────
  generarReporte(metricas, dataGraficos, usuario) {
    try {
      this.inicializarDocumento();

      const fechaGeneracion = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const mesLabel = usuario.mes
        ? dataGraficos.mesesDisponibles?.find(m => m.mes === usuario.mes)?.nombreMes || usuario.mes
        : null;

      let yPos = this.agregarEncabezado(usuario, fechaGeneracion, mesLabel);
      yPos = this.agregarKPIs(metricas, yPos);
      yPos = this.agregarAnalisisEficiencia(metricas, dataGraficos.completadasMes, yPos);
      yPos = this.agregarAlertas(metricas, dataGraficos.categorias, yPos);

      this.agregarPieDePagina();

      const nombreArchivo = `Reporte_${usuario.num_documento}_${Date.now()}.pdf`;
      this.doc.save(nombreArchivo);

      return { success: true, mensaje: 'PDF generado exitosamente', nombreArchivo };

    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      return { success: false, mensaje: 'Error al generar el PDF', error: error.message };
    }
  }
}

export const pdfService = new PDFService();