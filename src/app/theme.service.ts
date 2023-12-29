import { Injectable, Inject,Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private primaryColor = '--primary-color';
  private secondaryColor = '--primary-color-text';
  private surface_900 = '--surface-900';

  constructor(@Inject(DOCUMENT) private document: Document,rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // getPrimaryColor(): string {
  //   return getComputedStyle(document.documentElement).getPropertyValue(this.primaryColor).trim();
  // }

  setPrimaryColor(selectedColor: any,): void {
    // primary:'#EF018F',secondary:'#fff',success:'#11CF46',error:'#CC3514',warning:'#FF6847'
    this.document.documentElement.style.setProperty(this.primaryColor, selectedColor.primary);
    this.document.documentElement.style.setProperty(this.secondaryColor, selectedColor.secondary);
    this.document.documentElement.style.setProperty(this.surface_900, selectedColor.surface_900);
  }

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
}
