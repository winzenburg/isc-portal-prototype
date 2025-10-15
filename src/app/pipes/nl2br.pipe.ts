import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    // Convert markdown-style formatting to HTML
    let html = value
      // Bold text (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^•\s(.+)$/gm, '<li>$1</li>')
      // Convert double newlines to paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Convert single newlines to br
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags if not already wrapped
    if (!html.startsWith('<p>')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('</p>')) {
      html = html + '</p>';
    }

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
