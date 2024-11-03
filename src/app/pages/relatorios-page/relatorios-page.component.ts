import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Component } from '@angular/core';
import { ReportLivroAutor } from '../../models/report-livro-autor';
import { ReportLivroAutorExibicao } from '../../models/report-livro-autor-exibicao';
import { LivroAutorExibicao } from '../../models/livro-autor-exibicao';
import { ReportService } from '../../services/report-service';


@Component({
  selector: 'app-relatorios-page',
  standalone: true,
  imports: [],
  templateUrl: './relatorios-page.component.html',
  styleUrl: './relatorios-page.component.css'
})
export class RelatorioPageComponent {
  reportLivroPorAutor: ReportLivroAutor[] = [];
  reportLivroPorAutorExibicao: ReportLivroAutorExibicao[] = [];

  constructor(private service: ReportService) { }

  ngOnInit(): void {
    this.obterDados();
  }

  async obterDados() {
    this.reportLivroPorAutor = await this.service.getReportLivroPorAutor();

    const livroAutorExibicao = new Map<number, ReportLivroAutorExibicao>();

    this.reportLivroPorAutor.forEach((item) => {
      if (!livroAutorExibicao.has(item.codAu)) {
        livroAutorExibicao.set(item.codAu, {
          codAu: item.codAu,
          nomeAutor: item.nomeAutor,
          livrosExibicao: [],
        });
      }

      const autor = livroAutorExibicao.get(item.codAu);

      if (autor) {
        const livro: LivroAutorExibicao = {
          titulo: item.titulo,
          editora: item.editora,
          edicao: item.edicao,
          anoPublicacao: item.anoPublicacao,
          assuntos: item.assuntos
        };

        autor.livrosExibicao.push(livro);
      }
    });

    this.reportLivroPorAutorExibicao = Array.from(livroAutorExibicao.values());
  }

  exportToPDF() {
    const element = document.getElementById('reporToExport');
    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 5; // Margem de 5 mm
        const imgWidth = 210 - margin * 2; // Subtrai 20 mm (10 mm de cada lado)
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
      
        let position = margin; // Começa com margem
      
        // Adiciona a primeira página
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // 5 mm de margem à esquerda
        heightLeft -= pageHeight - margin * 2; // Ajusta altura disponível considerando margens
      
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + margin; // Ajusta para margem inferior
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // 5 mm de margem à esquerda
          heightLeft -= pageHeight - margin * 2; // Ajusta altura disponível considerando margens
        }
      
        pdf.save('report-livros-por-autor.pdf');
      });
    }
  }
}
