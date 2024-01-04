import { Injectable, Inject,Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;

  private colorVariables:any = {
    primary: '--primary-color',
    secondary: '--primary-color-text',
    surface_900: '--surface-900',
    primary_color_text: '--primary-color-text',
    body_color: '--body-color',
    text_color: '--text-color',
    hover_color:'--hover-color',
    highlight_color:'--highlight-color',
    focused_color:'--focused-color',
    border_color:'--border-color',
  };

  constructor(@Inject(DOCUMENT) private document: Document,rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  changeColorTheme(selectedColor: any,): void {
    for (const key in this.colorVariables) {
      if (this.colorVariables.hasOwnProperty(key)) {
        this.document.documentElement.style.setProperty(this.colorVariables[key], selectedColor[key]);
      }
    }
  }

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
}
