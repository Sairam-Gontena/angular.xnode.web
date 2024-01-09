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
    
    
    
    

    // BUTTON
    primary_button_color:'--primary-button-color',
    primary_button_text_color:'--primary-button-text-color',
    primary_button_inactive:'--primary-button-inactive',
    secondary_button_color:'--secondary-button-color',
    secondary_button_text_color:'--secondary-button-text-color',

    // INPUT TEXT
    inputtext_background_color:'--inputtext-background-color',
    inputtext_focused_color:'--inputtext-focused-color',
    inputtext_border_color:'--inputtext-border-color',
    inputtext_text_color:'--inputtext-text-color',
    inputtext_placeholder_text_color:'--inputtext-placeholder-text-color',

    // DROPDOWN
    dropdown_background_color:'--dropdown-background-color',
    dropdown_border_color:'--dropdown-border-color',
    dropdown_label_placeholder_color:'--dropdown-label-placeholder-color',
    dropdown_label_placeholder_focus_color:'--dropdown-label-placeholder-focus-color',
    dropdown_panel_background_color:'--dropdown-panel-background-color',
    dropdown_item_hightlight_color:'--dropdown-item-hightlight-color',
    dropdown_item_focus_color:'--dropdown-item-focus-color',
    dropdown_item_hover_color:'--dropdown-item-hover-color',
    dropdown_text_color:'--dropdown-text-color',

    // TABVIEW
    tabview_nav_background_color:'--tabview-nav-background-color',
    tabview_nav_border_color:'--tabview-nav-border-color:',
    tabview_nav_link_background_color:'--tabview-nav-link-background-color',
    tabview_nav_link_hover_color:'--tabview-nav-link-hover-color',
    tabview_nav_link_hightlight_color:'--tabview-nav-link-highlight-color',
    tabview_text_color:'--tabview-text-color',

    // ACCORDION
    accordion_backgrounnd_color:'--accordion-background-color',
    accordion_border_color:'--accordion-border-color',
    accordion_header_text_color:'--accordion-header-text-color',
    accordion_header_highlight_color:'--accordion-header-highlight-color',
    accordion_header_highlight_link_border_color:'--accordion-header-highlight-link-border-color',
    accordion_header_link_highlight_text_color:'--accordion-header-link-highlight-text-color',
    accordion_header_link_hover_color:'--accordion-header-link-hover-color',
    accordion_header_link_hover_border_color:'--accordion-header-link-hover-border-color',
    accordion_header_link_hover_text_color:'--accordion-header-link-hover-text-color',
    accordion_content_background_color:'--accordion-content-background-color',
    accordion_content_border_color:'--accordion-content-border-color',
    accordion_content_text_color:'--accordion-content-text-color',

    // OVERLAY PANEL
    overlay_background_color: '--overlay-background-color',
    overlay_hover_background_color: '--overlay-hover-background-color:',
    overlay_text_color:'--overlay-text-color',
    overlay_border_color:'--overlay-border-color',

    // DATA TABLE
    datatable_border_color:'--datatable-border-color',
    datatable_header_background_color: '--datatable-header-background-color',
    datatable_header_text_color:'--datatable-header-text-color',
    datatable_header_border_color:'--datatable-header-border-color',
    datatable_header_row_background_color:'--datatable-header-row-background-color',
    datatable_header_row_text_color:'--datatable-header-row-text-color',
    datatable_footer_background_color:"--datatable-footer-background-color",
    datatable_footer_text_color:'--datatable-footer-text-color',
    datatable_body_row_background_color:'--datatable-body-row-background-color',

    // TIDERMENU 
    tierdermenu_overlay_background_color:'--tieredmenu-overlay-background-color',
    tieredmenu_menuitem_focus_background_color:'--tieredmenu-menuitem-focus-background-color',
    tieredmenu_menuitem_hover_background_color:'--tieredmenu-menuitem-hover-background-color',
    tieredmenu_menuitem_text_color:'--tieredmenu-menuitem-text-color'

  };

  constructor(@Inject(DOCUMENT) private document: Document,rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  changeColorTheme(selectedColor: any): void {
    for (const colorCategory in selectedColor.color_codes) {
        if (selectedColor.color_codes.hasOwnProperty(colorCategory)) {
            const colorObject = selectedColor.color_codes[colorCategory];
            
            for (const key in this.colorVariables) {
                if (this.colorVariables.hasOwnProperty(key) && colorObject && colorObject[key] !== undefined) {
                    this.document.documentElement.style.setProperty(
                        this.colorVariables[key],
                        colorObject[key]
                    );
                }
            }
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
