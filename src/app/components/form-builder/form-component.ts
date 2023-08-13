export class FormComponent {
  value: any;
  key: string;
  label: string;
  required: boolean;
  controlType: string;
  type: string;
  order: number;
  options?: { key: string; value: string }[];

  constructor(
    options: {
      value?: any;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}
