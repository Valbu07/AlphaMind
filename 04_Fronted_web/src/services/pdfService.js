import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


class PDFService {
  
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width en mm
    this.pageHeight = 297; // A4 height en mm
    this.margin = 20;
  }

  /**
   * Inicializa un nuevo documento PDF
   */
  inicializarDocumento() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  /**
   * Agrega el encabezado corporativo del reporte
   */
  agregarEncabezado(usuario, fechaGeneracion) {
    // Logo/Título de la empresa
    this.doc.setFontSize(22);
    this.doc.setTextColor(30, 58, 138); // Azul corporativo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ALPHAMIND - CDA CEDIPLUS SOACHA', this.pageWidth / 2, 20, { align: 'center' });

    // Subtítulo
    this.doc.setFontSize(16);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Reporte de Desempeño', this.pageWidth / 2, 28, { align: 'center' });

    // Línea separadora
    this.doc.setDrawColor(30, 58, 138);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 32, this.pageWidth - this.margin, 32);

    // Información del usuario
    this.doc.setFontSize(11);
    this.doc.setTextColor(50, 50, 50);
    this.doc.setFont('helvetica', 'normal');
    
    const yPos = 40;
    this.doc.text(`Usuario: ${usuario.num_documento}`, this.margin, yPos);
    this.doc.text(`Fecha: ${fechaGeneracion}`, this.pageWidth - this.margin - 79, yPos);
    
    if (usuario.nombre) {
      this.doc.text(`Nombre: ${usuario.nombre}`, this.margin, yPos + 6);
    }

    return yPos + 15; // Retorna posición Y para continuar
  }

  /**
   * Agrega sección de KPIs (métricas clave)
   */
  agregarKPIs(metricas, yPosition) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 58, 138);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumen de Desempeño', this.margin, yPosition);

    const kpiData = [
      ['Indicador', 'Valor', 'Estado'],
      [
        'Tareas Totales', 
        metricas.tareasTotales.toString(),
        ' Total'
      ],
      [
        'Tareas Completadas', 
        metricas.completadas.toString(),
        metricas.completadas > 0 ? ' Buen Desempeño' : ' Bajo'
      ],
      [
        'Tareas Pendientes', 
        metricas.pendientes.toString(),
        metricas.pendientes > 5 ? 'Alta Carga' : ' Normal'
      ],
      [
        'Tareas Atrasadas', 
        metricas.atrasadas.toString(),
        metricas.atrasadas > 2 ? ' Atención' : ' Bien'
      ]
    ];

    autoTable(this.doc,{
      startY: yPosition + 5,
      head: [kpiData[0]],
      body: kpiData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: this.margin, right: this.margin }
    });

    return this.doc.lastAutoTable.finalY + 10;
  }

  /**
   * Agrega tabla de tareas completadas por mes
   */
  agregarTablaMeses(completadasMes, yPosition, tareasTotales) {
    if (!completadasMes || completadasMes.length === 0) {
      return yPosition;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 58, 138);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Tareas Completadas por Mes', this.margin, yPosition );

    const mesesData = [
      ['Mes', 'Cantidad Completada', 'Porcentaje'],
      ...completadasMes.map(item => {
        const total = completadasMes.reduce((sum, i) => sum + i.total, 0);
        const porcentaje = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0';
        return [
          item.nombreMes,
          item.total.toString(),
          `${porcentaje}%`
        ];
      })
    ];

    autoTable(this.doc,{
      startY: yPosition + 5,
      head: [mesesData[0]],
      body: mesesData.slice(1),
      theme: 'striped',
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: this.margin, right: this.margin }
    });

    return this.doc.lastAutoTable.finalY + 10;
  }

  /**
   * Agrega tabla de categorías
   */
  agregarTablaCategorias(categorias, yPosition) {
    if (!categorias || categorias.length === 0) {
      return yPosition;
    }

    // Verificar si necesitamos nueva página
    if (yPosition > this.pageHeight - 60) {
      this.doc.addPage();
      yPosition = this.margin;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 58, 138);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribución por Categoría', this.margin, yPosition);

    const categoriasData = [
      ['Categoría', 'Cantidad', 'Porcentaje'],
      ...categorias.map(item => {
        const total = categorias.reduce((sum, i) => sum + i.total, 0);
        const porcentaje = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0';
        return [
          item.categoria,
          item.total.toString(),
          `${porcentaje}%`
        ];
      })
    ];

    autoTable(this.doc,{
      startY: yPosition + 5,
      head: [categoriasData[0]],
      body: categoriasData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [60, 165, 250],
        textColor: 255,
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: this.margin, right: this.margin }
    });

    return this.doc.lastAutoTable.finalY + 10;
  }

  /**
   * Agrega tabla de estados
   */
  agregarTablaEstados(estados, yPosition) {
    if (!estados || estados.length === 0) {
      return yPosition;
    }

    // Verificar espacio en página
    if (yPosition > this.pageHeight - 60) {
      this.doc.addPage();
      yPosition = this.margin;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 58, 138);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Estado Actual de Tareas', this.margin, yPosition);

    const estadosData = [
      ['Estado', 'Cantidad', 'Porcentaje'],
      ...estados.map(item => {
        const total = estados.reduce((sum, i) => sum + i.total, 0);
        const porcentaje = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0';
        return [
          item.estado,
          item.total.toString(),
          `${porcentaje}%`
        ];
      })
    ];

    autoTable(this.doc,{
      startY: yPosition + 5,
      head: [estadosData[0]],
      body: estadosData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [169, 201, 255],
        textColor: [30, 58, 138],
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: this.margin, right: this.margin }
    });

    return this.doc.lastAutoTable.finalY + 10;
  }

  /**
   * Agrega pie de página
   */
  agregarPieDePagina() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(9);
      this.doc.setTextColor(150, 150, 150);
      this.doc.setFont('helvetica', 'italic');
      
      // Texto de confidencialidad
      this.doc.text(
        'Documento confidencial - CDA CEDIPLUS SOACHA',
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
      
      // Número de página
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth - this.margin,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  /**
   * Método principal para generar el reporte completo
   */
  generarReporte(metricas, dataGraficos, usuario) {
    try {
      // 1. Inicializar documento
      this.inicializarDocumento();

      // 2. Fecha de generación
      const fechaGeneracion = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // 3. Agregar secciones en orden
      let yPos = this.agregarEncabezado(usuario, fechaGeneracion);
      yPos = this.agregarKPIs(metricas, yPos);
      yPos = this.agregarTablaMeses(dataGraficos.completadasMes, yPos);
      yPos = this.agregarTablaCategorias(dataGraficos.categorias, yPos);
      yPos = this.agregarTablaEstados(dataGraficos.estados, yPos);

      // 4. Agregar pie de página
      this.agregarPieDePagina();

      // 5. Guardar documento
      const nombreArchivo = `Reporte_${usuario.num_documento}_${new Date().getTime()}.pdf`;
      this.doc.save(nombreArchivo);

      return {
        success: true,
        mensaje: 'PDF generado exitosamente',
        nombreArchivo
      };

    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      return {
        success: false,
        mensaje: 'Error al generar el PDF',
        error: error.message
      };
    }
  }
}

// Exportar instancia única (Singleton)
export const pdfService = new PDFService();