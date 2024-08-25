import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { base64StringToBlob } from 'blob-util';
import VCard from 'vcf';

@Component({
  selector: 'app-presentation',
  standalone: true,
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css'],
})
export class PresentationComponent {
  static fileName = 'Miguelina_Ruiz.vcf';
  download: () => void = () => {};

  nombre: string = 'Miguelina Ruiz';
  titulo: string = 'Directora';
  work: string = 'Oficina de Promocion Turistica de la Republica Dominicana';
  email: string = 'm.ruiz@mitur.gob.do';
  telefono: string = '+584143315304';
  linkedin: string = 'https://www.linkedin.com/in/miguelina-ruiz-10664ba7';
  instagram: string = 'https://www.instagram.com/miguelinaruiz/';
  whatsapp: string = 'https://wa.me/584143315304';

  constructor(private sanitizer: DomSanitizer) {
    if (this.isBrowser()) {
      this.delegator();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private delegator(): void {
    const isIE = !!(
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1
    );
    this.download = isIE ? this.IE : this.regularBrowser;
  }

  private async vCardCreator(): Promise<string> {
    const vCard = new VCard();
    vCard.version = '3.0';
    vCard.set('fn', this.nombre);
    vCard.set('title', this.titulo);
    vCard.set('org', this.work);
    vCard.set('email', this.email);
    vCard.set('tel', this.telefono);
    vCard.set('url', this.linkedin);

    const photoBase64 = await this.getBase64ImageFromURL(
      '/miguelina-page/assets/img/miguelina_ruiz.jpg'
    );
    vCard.set('photo', `data:image/jpeg;base64,${photoBase64}`);

    return vCard.toString();
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL.split(',')[1]);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  private async blobable(): Promise<Blob> {
    const contentType = 'text/vcard';
    const vCardString = await this.vCardCreator();
    return new Blob([vCardString], { type: contentType });
  }

  private async IE(): Promise<void> {
    const blob = await this.blobable();
    (window.navigator as any).msSaveOrOpenBlob(
      blob,
      PresentationComponent.fileName
    );
  }

  private async regularBrowser(): Promise<void> {
    const blob = await this.blobable();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = PresentationComponent.fileName;
    document.body.appendChild(a); // Necesario para Firefox
    a.click();
    document.body.removeChild(a); // Limpieza
    window.URL.revokeObjectURL(url);
  }

  async saveContact(type: string): Promise<void> {
    switch (type) {
      case 'instagram':
        window.location.href = this.instagram;
        break;
      case 'linkedin':
        window.location.href = this.linkedin;
        break;
      case 'whatsapp':
        window.location.href = this.whatsapp;
        break;
      case 'phone':
        await this.download();
        break;
      default:
        alert('Tipo de contacto no reconocido.');
    }
  }
}
