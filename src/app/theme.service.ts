import { Injectable, Inject,Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private renderer: Renderer2;

  private colorVariables:any = {
    // primary: '--primary-color',
    // secondary: '--primary-color-text',
    // surface_900: '--surface-900',
    // primary_color_text: '--primary-color-text',
    // body_color: '--body-color',
    // text_color: '--text-color',
    // hover_color:'--hover-color',
    // highlight_color:'--highlight-color',
    // focused_color:'--focused-color',
    // border_color:'--border-color',

    // BUTTON
    primary_button_color:'--primary-button-color',
    primary_button_text_color:'--primary-button-text-color',
    primary_button_inactive:'--primary-button-inactive',
    secondary_button_color:'--secondary-button-color',
    secondary_button_text_color:'--secondary-button-text-color',
    teritory_button_text_color:'--teritory-button-text-color',
    teritory_button_border_color:'--teritory-button-border-color',

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
    dropdown_label_text_color:'--dropdown-label-text-color',
    dropdown_label_placeholder_focus_color:'--dropdown-label-placeholder-focus-color',
    dropdown_panel_background_color:'--dropdown-panel-background-color',
    dropdown_panel_border_color:'--dropdown-panel-border-color',
    dropdown_item_inactive_text_color:'--dropdown-item-inactive-text-color',
    dropdown_item_highlight_text_color:'--dropdown-item-hightlight-text-color',
    dropdown_item_hightlight_color:'--dropdown-item-hightlight-color',
    dropdown_item_focus_color:'--dropdown-item-focus-color',
    dropdown_item_hover_color:'--dropdown-item-hover-color',
    dropdown_text_color:'--dropdown-text-color',

    // TABVIEW
    tabview_panels_background_color:'--tabview-panels-background-color',
    tabview_nav_background_color:'--tabview-nav-background-color',
    tabview_nav_border_color:'--tabview-nav-border-color',
    tabview_nav_link_background_color:'--tabview-nav-link-background-color',
    tabview_nav_link_hover_color:'--tabview-nav-link-hover-color',
    tabview_nav_link_hover_text_color:'--tabview-nav-link-hover-text-color',
    tabview_nav_link_hover_border_color:'--tabview-nav-link-hover-border-color',
    tabview_nav_link_hightlight_color:'--tabview-nav-link-highlight-color',
    tabview_nav_link_hightlight_text_color:'--tabview-nav-link-highlight-text-color',
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
    tieredmenu_menuitem_text_color:'--tieredmenu-menuitem-text-color',

    // MULTISELECT
    multiselect_label_container_background_color:"--multiselect-label-container-background-color",
    multiselect_pannel_backgrounnd_color:"--multiselect-pannel-background-color",
    multiselect_pannel_border_color:"--multiselect-pannel-border-color",
    multiselect_pannel_header_border_color:"--multiselect-pannel-header-border-color",
    multiselect_filter_container_background_color:"--multiselect-filter-container-background-color",
    multiselect_filter_icon_color:"--multiselect-filter-icon-color",
    multiselect_item_inactive_text_color:"--multiselect-item-inactive-text-color",
    multiselect_item_highlight_text_color:"--multiselect-item-highlight-text-color",
    multiselect_item_focus_background_color:"--multiselect-item-focus-background-color",
    multiselect_item_hover_text_color:"--multiselect-item-hover-text-color",
    multiselect_item_hover_background_color:"--multiselect-item-hover-background-color",
    multiselect_checkbox_inactive_color:"--multiselect-checkbox-inactive-color",
    multiselect_checkbox_highlight_color:"--multiselect-checkbox-highlight-color",

    // DIALOG
    diaglog_container_background_color:"--dialog-container-background-color",
    dialog_container_border_color:"--dialog-container-border-color",
    dialog_header_background_color:"--dialog-header-background-color",
    dialog_header_text_color:"--dialog-header-text-color",
    dialog_content_text_color:"--dialog-content-text-color",
    dialog_content_background_color:"--dialog-content-background-color",
    dialog_footer_background_color:"--dialog-footer-background-color",

    // SIDEBAR
    sidebar_background_color:"--sidebar-background-color",

    // DATEPICKER
    datepicker_background_color:'--datepicker-background-color',
    datepicker_header_background_color:'--datepicker-header-background-color',
    datepicker_header_border_color:'--datepicker-header-border-color',
    datepicker_disabked_background_color:'--datepicker-disabled-background-color',
    datepicker_hightlight_background_color:'--datepicker-hightlight-background-color'

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
