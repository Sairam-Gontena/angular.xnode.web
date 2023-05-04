const FORM_SCHEMA = {
    'FORM': [
        { label: 'NAME', code: 'name', dataType: 'text' },
        { label: 'IMAGE', code: 'image', dataType: 'image' },
        { label: 'Description', code: 'description', dataType: 'textarea' },

    ],

    'FORM1': [
        { label: 'Category', code: 'category', dataType: 'dropdown', options: [{ name: 'Accessory Item', code: 'Accessories' }, { label: 'Electronic Items', code: 'Electronics' }] },
        { label: 'Quantity', code: 'quantity', dataType: 'number' },

    ],
    'FORM2': [
        { label: 'Inventory Status', code: 'inventoryStatus', dataType: 'dropdown', options: [{ name: 'Available', code: 'INSTOCK' }, { name: 'Not Available', code: 'OUTOFSTOCK' }, { label: 'Only Limited', code: 'LOWSTOCK' }] },
        { label: 'rating', code: 'rating', dataType: 'number' },
    ],
    'DEFAULT': [
        { label: 'NAME', code: 'name', dataType: 'text' },
        { label: 'Category', code: 'category', dataType: 'dropdown', options: [{ name: 'Accessory Item', code: 'Accessories' }, { label: 'Electronic Items', code: 'Electronics' }] },
        { label: 'Quantity', code: 'quantity', dataType: 'number' },
        { label: 'Inventory Status', code: 'inventoryStatus', dataType: 'dropdown', options: [{ name: 'Available', code: 'INSTOCK' }, { name: 'Not Available', code: 'OUTOFSTOCK' }, { label: 'Only Limited', code: 'LOWSTOCK' }] },
        { label: 'rating', code: 'rating', dataType: 'number' },
    ]
}
export default FORM_SCHEMA