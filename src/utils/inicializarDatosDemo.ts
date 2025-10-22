import { supabase } from "@/integrations/supabase/client";

export const inicializarDatosDemo = async (userId: string) => {
  try {
    console.log('🚀 Inicializando datos demo para usuario:', userId);

    // Verificar si ya tiene datos
    const { data: existingClientes } = await supabase
      .from('clientes')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existingClientes && existingClientes.length > 0) {
      console.log('✅ Usuario ya tiene datos, omitiendo inicialización');
      return;
    }

    // 1. Crear clientes demo
    const clientesDemo = [
      {
        user_id: userId,
        nombre: 'Cliente General S.A.',
        nit: '1020304050',
        email: 'contacto@clientegeneral.com',
        telefono: '70123456',
        direccion: 'Av. 6 de Agosto #1234, La Paz',
        activo: true
      },
      {
        user_id: userId,
        nombre: 'Distribuidora Central',
        nit: '2030405060',
        email: 'ventas@distribuidora.com',
        telefono: '71234567',
        direccion: 'Calle Comercio #567, La Paz',
        activo: true
      },
      {
        user_id: userId,
        nombre: 'Importadora Bolivia Ltda.',
        nit: '3040506070',
        email: 'info@importadora.com',
        telefono: '72345678',
        direccion: 'Zona Sur #890, La Paz',
        activo: true
      }
    ];

    const { error: clientesError } = await supabase
      .from('clientes')
      .insert(clientesDemo);

    if (clientesError) throw clientesError;

    console.log('✅ Clientes demo creados');

    // 2. Crear proveedores demo
    const proveedoresDemo = [
      {
        user_id: userId,
        codigo: 'PROV001',
        nombre: 'Proveedor Nacional S.R.L.',
        nit: '4050607080',
        email: 'contacto@provnacional.com',
        telefono: '73456789',
        direccion: 'Av. Buenos Aires #123, La Paz',
        activo: true,
        saldo_deuda: 0
      },
      {
        user_id: userId,
        codigo: 'PROV002',
        nombre: 'Suministros Industriales',
        nit: '5060708090',
        email: 'ventas@suministros.com',
        telefono: '74567890',
        direccion: 'Calle Industria #456, El Alto',
        activo: true,
        saldo_deuda: 0
      },
      {
        user_id: userId,
        codigo: 'PROV003',
        nombre: 'Tecnología y Equipos',
        nit: '6070809000',
        email: 'info@tecequipos.com',
        telefono: '75678901',
        direccion: 'Zona Central #789, La Paz',
        activo: true,
        saldo_deuda: 0
      }
    ];

    const { error: proveedoresError } = await supabase
      .from('proveedores')
      .insert(proveedoresDemo);

    if (proveedoresError) throw proveedoresError;

    console.log('✅ Proveedores demo creados');

    // 3. Crear categorías de productos demo si no existen
    const { data: existingCategorias } = await supabase
      .from('categorias_productos')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!existingCategorias || existingCategorias.length === 0) {
      const categoriasDemo = [
        {
          user_id: userId,
          nombre: 'Electrónica',
          descripcion: 'Productos electrónicos y tecnológicos',
          activo: true
        },
        {
          user_id: userId,
          nombre: 'Oficina',
          descripcion: 'Artículos y suministros de oficina',
          activo: true
        },
        {
          user_id: userId,
          nombre: 'Servicios',
          descripcion: 'Servicios profesionales y consultoría',
          activo: true
        }
      ];

      const { error: categoriasError } = await supabase
        .from('categorias_productos')
        .insert(categoriasDemo);

      if (categoriasError) throw categoriasError;

      console.log('✅ Categorías demo creadas');
    }

    console.log('🎉 Datos demo inicializados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando datos demo:', error);
    throw error;
  }
};
