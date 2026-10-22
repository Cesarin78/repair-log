// =====================================================================
//  codes.js  —  THE REPAIR CODES AND ROOM NAMES
//  This is the easiest file to edit. To add a new repair type, copy one
//  line inside "items" and change the code and the words.
//  "es" = Spanish text, "en" = English text.
// =====================================================================

window.APP_CODES = {
  trades: [
    {
      id: '1', es: 'Plomería', en: 'Plumbing',
      items: [
        { code: '1.1', es: 'Fugas de agua', en: 'Water leaks' },
        { code: '1.2', es: 'Tubería sobresale de la pared', en: 'Pipe sticking out of wall' },
        { code: '1.3', es: 'Reubicación de válvula de regadera/bañera', en: 'Shower/tub valve relocation' },
        { code: '1.4', es: 'Agregar correas a tuberías', en: 'Add pipe straps' }
      ]
    },
    {
      id: '2', es: 'Electricidad', en: 'Electrical',
      items: [
        { code: '2.1', es: 'Reubicar cajas, luces y switches', en: 'Relocate boxes, lights & switches' },
        { code: '2.2', es: 'Correr cable', en: 'Run cable' }
      ]
    },
    {
      id: '3', es: 'HVAC', en: 'HVAC',
      items: [
        { code: '3.1', es: 'Mover termostato', en: 'Move thermostat' },
        { code: '3.2', es: 'Terminar conexión de ductos', en: 'Finish duct connection' }
      ]
    },
    {
      id: '4', es: 'Fire sprinklers', en: 'Fire sprinklers',
      items: [
        { code: '4.1', es: 'Reemplazar tipo de cabeza', en: 'Replace head type' },
        { code: '4.2', es: 'Ajustar altura de tubería', en: 'Adjust pipe height' }
      ]
    },
    {
      id: '5', es: 'Fibra óptica', en: 'Fiber optic',
      items: [
        { code: '5.1', es: 'Reparación general', en: 'General repair' }
      ]
    },
    {
      // isGC: true  ->  the GC's name (set in Settings) is added to the title
      id: '6', es: 'GC', en: 'GC', isGC: true,
      items: [
        { code: '6.1', es: 'Edificio no dry-in (daño por lluvia)', en: 'Building not dried in (rain damage)' },
        { code: '6.2', es: 'Daños por falta de calefacción', en: 'Damage from no heat' },
        { code: '6.3', es: 'Error de diseño de unidad', en: 'Unit design error' }
      ]
    }
  ],

  // Suggestions shown in the "Location" box. Workers can still type anything.
  locations: [
    { es: 'Sala', en: 'Living room' },
    { es: 'Cocina', en: 'Kitchen' },
    { es: 'Comedor', en: 'Dining room' },
    { es: 'Recámara', en: 'Bedroom' },
    { es: 'Recámara principal', en: 'Primary bedroom' },
    { es: 'Recámara del fondo', en: 'Back bedroom' },
    { es: 'Baño', en: 'Bathroom' },
    { es: 'Baño principal', en: 'Primary bathroom' },
    { es: 'Pasillo', en: 'Hallway' },
    { es: 'Closet', en: 'Closet' },
    { es: 'Lavandería', en: 'Laundry' },
    { es: 'Entrada', en: 'Entry' },
    { es: 'Balcón', en: 'Balcony' },
    { es: 'Área común', en: 'Common area' }
  ]
};
