import { Component } from '@angular/core';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css',
})
export class PresentationComponent {
  nombre: string = 'Miguelina Ruiz';
  titulo: string =
    'Directora de la Ofina de Turismo de la Republica Dominicana';
  email: string = 'juan.perez@example.com';
  telefono: string = '+123 456 7890';
  linkedin: string = 'https://www.linkedin.com/in/miguelina-ruiz-10664ba7';
  instagram: string = 'https://www.instagram.com/miguelinaruiz/';

  constructor() {}

  saveContact(type: string) {
    switch (type) {
      case 'instagram':
        window.location.href = this.instagram;
        break;
      case 'linkedin':
        window.location.href = this.linkedin;
        break;
      case 'phone':
        this.downloadVCard();
        break;
      default:
        alert('Tipo de contacto no reconocido.');
    }
  }

  downloadVCard() {
    const vCardData = `
          BEGIN:VCARD
          VERSION:3.0
          FN:${this.nombre}
          TITLE:${this.titulo}
          EMAIL:${this.email}
          TEL:${this.telefono}
          URL:${this.linkedin}
          END:VCARD
      `;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.nombre}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
